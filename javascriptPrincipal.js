class Jogo {
  constructor(id, timeCasa, timeFora, bandeiraCasa, bandeiraFora, data, fase, tipo, valor, odd) {
    this.id = id;
    this.timeCasa = timeCasa;
    this.timeFora = timeFora;
    this.bandeiraCasa = bandeiraCasa;
    this.bandeiraFora = bandeiraFora;
    this.data = data;
    this.fase = fase;
    this.tipo = tipo;
    this.valor = valor;
    this.odd = odd;
    this.golsCasa = 0;
    this.golsFora = 0;
  }

  placar() {
    return `${this.golsCasa} x ${this.golsFora}`;
  }

  retornoPossivel() {
    return this.valor * this.odd;
  }
}

class Aposta {
  constructor(jogo) {
    this.id = Date.now();
    this.jogoId = jogo.id;
    this.timeCasa = jogo.timeCasa;
    this.timeFora = jogo.timeFora;
    this.placar = jogo.placar();
    this.valor = jogo.valor;
    this.retornoPossivel = jogo.retornoPossivel();
  }

  resumo() {
    return `${this.timeCasa} ${this.placar} ${this.timeFora}`;
  }
}

function bolaoApp() {
  return {
    filtro: "todos",
    aviso: "",
    apostas: [],

    jogos: [
      new Jogo(1, "Brasil", "Alemanha", "🇧🇷", "🇩🇪", "13 jun 2026 - 16:00", "Grupo A", "grupo", 25, 2.5),
      new Jogo(2, "Argentina", "França", "🇦🇷", "🇫🇷", "14 jun 2026 - 18:00", "Grupo B", "grupo", 30, 2.2),
      new Jogo(3, "Espanha", "Inglaterra", "🇪🇸", "🇬🇧", "15 jun 2026 - 15:00", "Grupo C", "grupo", 20, 2.8),
      new Jogo(4, "Portugal", "Uruguai", "🇵🇹", "🇺🇾", "16 jun 2026 - 21:00", "Grupo D", "grupo", 20, 3.1),
      new Jogo(5, "México", "Estados Unidos", "🇲🇽", "🇺🇸", "22 jun 2026 - 20:00", "Oitavas", "mataMata", 35, 2.4),
      new Jogo(6, "Holanda", "Croácia", "🇳🇱", "🇭🇷", "23 jun 2026 - 17:00", "Oitavas", "mataMata", 35, 2.7)
    ],

    jogosFiltrados() {
      if (this.filtro === "todos") {
        return this.jogos;
      }

      return this.jogos.filter((jogo) => jogo.tipo === this.filtro);
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
      this.mostrarAviso(`Aposta registrada: ${aposta.resumo()}`);
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
