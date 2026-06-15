class Jogo {
  constructor(dados) {
    this.id = Number(dados.id);
    this.grupo = dados.grupo;
    this.rodada = dados.rodada;
    this.data = dados.data;
    this.hora = dados.hora;
    this.timeCasa = dados.timeCasa;
    this.codigoCasa = dados.codigoCasa;
    this.bandeiraCasa = dados.bandeiraCasa;
    this.timeFora = dados.timeFora;
    this.codigoFora = dados.codigoFora;
    this.bandeiraFora = dados.bandeiraFora;
    this.estadio = dados.estadio;
    this.cidade = dados.cidade;
    this.valor = Number(dados.valor);
    this.odd = Number(dados.odd);
    this.golsCasa = 0;
    this.golsFora = 0;
  }

  placar() {
    return `${this.golsCasa} x ${this.golsFora}`;
  }

  retornoPossivel() {
    return this.valor * this.odd;
  }

  bandeiraCasaUrl() {
    return criarUrlBandeira(this.codigoCasa);
  }

  bandeiraForaUrl() {
    return criarUrlBandeira(this.codigoFora);
  }

  dataFormatada() {
    const data = new Date(`${this.data}T${this.hora}:00`);

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(data);
  }
}

const codigosBandeiras = {
  ARG: "ar",
  ALG: "dz",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BRA: "br",
  CAN: "ca",
  CIV: "ci",
  COD: "cd",
  COL: "co",
  CPV: "cv",
  CRO: "hr",
  CUW: "cw",
  CZE: "cz",
  ECU: "ec",
  EGY: "eg",
  ENG: "gb-eng",
  ESP: "es",
  FRA: "fr",
  GER: "de",
  GHA: "gh",
  HAI: "ht",
  IRN: "ir",
  IRQ: "iq",
  JOR: "jo",
  JPN: "jp",
  KOR: "kr",
  KSA: "sa",
  MAR: "ma",
  MEX: "mx",
  NED: "nl",
  NOR: "no",
  NZL: "nz",
  PAN: "pa",
  PAR: "py",
  POR: "pt",
  QAT: "qa",
  RSA: "za",
  SCO: "gb-sct",
  SEN: "sn",
  SUI: "ch",
  SWE: "se",
  TUN: "tn",
  TUR: "tr",
  URU: "uy",
  USA: "us",
  UZB: "uz"
};

function criarUrlBandeira(codigoFifa) {
  const codigo = codigosBandeiras[codigoFifa];
  return `https://flagcdn.com/w80/${codigo}.png`;
}

class Aposta {
  constructor(jogo) {
    this.id = Date.now();
    this.jogoId = jogo.id;
    this.grupo = jogo.grupo;
    this.rodada = jogo.rodada;
    this.timeCasa = jogo.timeCasa;
    this.timeFora = jogo.timeFora;
    this.bandeiraCasa = jogo.bandeiraCasaUrl();
    this.bandeiraFora = jogo.bandeiraForaUrl();
    this.data = jogo.dataFormatada();
    this.placar = jogo.placar();
    this.palpite = jogo.placar();
    this.valor = jogo.valor;
    this.retornoPossivel = jogo.retornoPossivel();
    this.status = "carrinho";
    this.pagamentoId = null;
  }

  resumo() {
    return `${this.timeCasa} ${this.placar} ${this.timeFora}`;
  }
}

class LeitorCsv {
  static converter(textoCsv) {
    const linhas = textoCsv
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);

    const cabecalhos = linhas.shift().split(",");

    return linhas.map((linha) => {
      const valores = linha.split(",");

      return cabecalhos.reduce((dados, cabecalho, indice) => {
        dados[cabecalho] = valores[indice];
        return dados;
      }, {});
    });
  }
}

function bolaoApp() {
  return {
    grupoSelecionado: "todos",
    rodadaSelecionada: "todas",
    carregando: true,
    erroCarregamento: "",
    aviso: "",
    apostas: [],
    jogos: [],

    async carregarJogos() {
      try {
        const resposta = await fetch("jogos-grupos.csv");

        if (!resposta.ok) {
          throw new Error("Arquivo jogos-grupos.csv não encontrado.");
        }

        const textoCsv = await resposta.text();
        this.jogos = LeitorCsv.converter(textoCsv).map((dados) => new Jogo(dados));
      } catch (erro) {
        this.erroCarregamento = "Abra a página pelo servidor local para permitir a leitura do arquivo CSV.";
      } finally {
        this.carregando = false;
      }
    },

    grupos() {
      return [...new Set(this.jogos.map((jogo) => jogo.grupo))].sort();
    },

    jogosFiltrados() {
      return this.jogos.filter((jogo) => {
        const passouGrupo = this.grupoSelecionado === "todos" || jogo.grupo === this.grupoSelecionado;
        const passouRodada = this.rodadaSelecionada === "todas" || jogo.rodada === this.rodadaSelecionada;

        return passouGrupo && passouRodada;
      });
    },

    apostar(jogo) {
      if (!Number.isInteger(jogo.golsCasa) || !Number.isInteger(jogo.golsFora)) {
        this.mostrarAviso("Informe um placar válido para apostar.");
        return;
      }

      if (jogo.golsCasa < 0 || jogo.golsFora < 0) {
        this.mostrarAviso("O placar não pode ter número negativo.");
        return;
      }

      const aposta = new Aposta(jogo);
      this.apostas.unshift(aposta);
      this.salvarApostaNoCarrinho(aposta);
      this.mostrarAviso(`Aposta registrada: ${aposta.resumo()}`);
    },

    salvarApostaNoCarrinho(aposta) {
      const apostasSalvas = JSON.parse(localStorage.getItem("bolaoApostas") || "[]");
      apostasSalvas.unshift(aposta);
      localStorage.setItem("bolaoApostas", JSON.stringify(apostasSalvas));
    },

    ultimaApostaTexto() {
      if (this.apostas.length === 0) {
        return "";
      }

      return this.apostas[0].resumo();
    },

    formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    },

    mostrarAviso(mensagem) {
      this.aviso = mensagem;

      setTimeout(() => {
        this.aviso = "";
      }, 2600);
    }
  };
}
