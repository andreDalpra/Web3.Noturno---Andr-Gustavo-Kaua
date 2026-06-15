function carrinhoApp() {
  return {
    filtro: "todas",
    pagamentoSelecionadoId: null,
    mostrarFormularioPagamento: false,
    apostaDetalhada: null,
    aviso: "",

    novoPagamento: {
      nome: "",
      detalhe: "",
      tipo: "cartao"
    },

    formasPagamento: [],

    apostas: [
      {
        id: 101,
        timeCasa: "Brasil",
        timeFora: "Alemanha",
        bandeiraCasa: "🇧🇷",
        bandeiraFora: "🇩🇪",
        data: "13 jun 2026",
        palpite: "Brasil vence",
        valor: 25,
        retornoPossivel: 62.5,
        status: "carrinho",
        pagamentoId: null
      }
    ],

    apostasFiltradas() {
      if (this.filtro === "todas") {
        return this.apostas;
      }

      return this.apostas.filter((aposta) => aposta.status === this.filtro);
    },

    adicionarFormaPagamento() {
      const icones = {
        cartao: "credit_card",
        pix: "qr_code_2",
        carteira: "account_balance_wallet"
      };

      const formaPagamento = {
        id: Date.now(),
        nome: this.novoPagamento.nome,
        detalhe: this.novoPagamento.detalhe,
        tipo: this.novoPagamento.tipo,
        icone: icones[this.novoPagamento.tipo]
      };

      this.formasPagamento.push(formaPagamento);
      this.pagamentoSelecionadoId = formaPagamento.id;

      this.novoPagamento = {
        nome: "",
        detalhe: "",
        tipo: "cartao"
      };

      this.mostrarFormularioPagamento = false;
      this.mostrarAviso("Forma de pagamento adicionada.");
    },

    finalizarAposta(apostaId) {
      if (!this.pagamentoSelecionadoId) {
        this.mostrarAviso("Cadastre e selecione uma forma de pagamento.");
        return;
      }

      const aposta = this.apostas.find((item) => item.id === apostaId);

      if (!aposta) {
        return;
      }

      aposta.status = "finalizada";
      aposta.pagamentoId = this.pagamentoSelecionadoId;

      this.mostrarAviso("Aposta finalizada com sucesso.");
    },

    abrirDetalhes(aposta) {
      this.apostaDetalhada = aposta;
    },

    nomePagamento(pagamentoId) {
      const forma = this.formasPagamento.find((item) => item.id === pagamentoId);
      return forma ? `${forma.nome} - ${forma.detalhe}` : "Não informado";
    },

    textoPagamento(aposta) {
      if (!aposta.pagamentoId) {
        return "Aguardando finalização";
      }

      return `Pago com ${this.nomePagamento(aposta.pagamentoId)}`;
    },

    textoStatus(status) {
      const textos = {
        carrinho: "No carrinho",
        finalizada: "Finalizada",
        venceu: "Venceu",
        perdeu: "Perdeu"
      };

      return textos[status] || "Não informado";
    },

    totalCarrinho() {
      return this.apostas
        .filter((aposta) => aposta.status === "carrinho")
        .reduce((total, aposta) => total + aposta.valor, 0);
    },

    totalPago() {
      return this.apostas
        .filter((aposta) => aposta.status !== "carrinho")
        .reduce((total, aposta) => total + aposta.valor, 0);
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