document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  const form = document.getElementById("cadastroForm");

  const showToast = (message) => {
    const oldToast = document.getElementById("toast-validation");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "toast-validation";
    toast.className = `fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto min-w-[320px] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium transition-all duration-500 transform -translate-y-20 opacity-0 border border-slate-700`;

    toast.innerHTML = `<i data-lucide="alert-circle" class="text-red-400"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove("-translate-y-20", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    }, 10);

    setTimeout(() => {
      toast.classList.add("-translate-y-20", "opacity-0");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  const mask = (id, fn) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener(
        "input",
        (e) => (e.target.value = fn(e.target.value)),
      );
  };

  mask("cpf", (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  );
  mask("cep", (v) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2"));
  mask("whatsapp_cliente", (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2"),
  );
  mask("telefone", (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2"),
  );
  mask("placa", (v) =>
    v
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .replace(/^([A-Z]{3})([0-9])/, "$1-$2"),
  );

  const maskMoeda = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
        v = (v / 100).toFixed(2).replace(".", ","); // Divide por 100 para centavos
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,"); // Milhão
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,"); // Milhar
        e.target.value = "R$ " + v;
      });
    }
  };

  maskMoeda("mensalidade");
  maskMoeda("instalacao");

  const validarEntradas = () => {
    const v = (id) => document.getElementById(id).value.trim();
    const el = (id) => document.getElementById(id);

    document
      .querySelectorAll(".input-field, select")
      .forEach((i) =>
        i.classList.remove("border-red-500", "ring-red-100", "ring-4"),
      );

    const regras = [
      {
        condicao: v("nome").length < 5,
        msg: "Digite o nome completo.",
        id: "nome",
      },
      { condicao: v("cpf").length < 14, msg: "CPF incompleto.", id: "cpf" },
      {
        condicao: v("nascimento") === "" || v("nascimento").length < 10,
        msg: "Informe a data de nascimento completa.",
        id: "nascimento",
      },
      {
        condicao: v("telefone").length < 14,
        msg: "Telefone fixo obrigatório ou incompleto.",
        id: "telefone",
      },
      {
        condicao: v("whatsapp_cliente").length < 14,
        msg: "WhatsApp inválido.",
        id: "whatsapp_cliente",
      },
      {
        condicao: !v("email").includes("@") || v("email").length < 5,
        msg: "E-mail inválido.",
        id: "email",
      },
      {
        condicao: v("endereco").length < 5,
        msg: "Endereço inválido.",
        id: "endereco",
      },
      {
        condicao: v("bairro").length < 3,
        msg: "Informe o bairro.",
        id: "bairro",
      },
      { condicao: v("cep").length < 9, msg: "CEP incompleto.", id: "cep" },
      {
        condicao: !v("vencimento"),
        msg: "Selecione o dia do vencimento.",
        id: "vencimento",
      },
      {
        condicao: !v("mensalidade"),
        msg: "Informe o valor da mensalidade.",
        id: "mensalidade",
      },
      {
        condicao: !v("instalacao"),
        msg: "Informe o valor da instalação.",
        id: "instalacao",
      },
      {
        condicao: v("veiculo").length < 2,
        msg: "Informe o modelo do veículo.",
        id: "veiculo",
      },
      {
        condicao: v("ano").length < 4,
        msg: "Ano do veículo inválido.",
        id: "ano",
      },
      {
        condicao: v("placa").length < 7,
        msg: "Placa incompleta.",
        id: "placa",
      },
      { condicao: !v("cor"), msg: "Informe a cor do veículo.", id: "cor" },
    ];

    for (let regra of regras) {
      if (regra.condicao) {
        const campo = el(regra.id);
        campo.classList.add("border-red-500", "ring-4", "ring-red-100");
        campo.focus();
        showToast(regra.msg);
        return false;
      }
    }
    return true;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validarEntradas()) {
      const val = (id) => document.getElementById(id).value;
      const fone = "5586995555573";

      const msg =
        `*CADASTRO DE CLIENTE - JARDEL SAT*%0A` +
        `` +
        `*DADOS PESSOAIS:*%0A` +
        `NOME: ${val("nome")}%0A` +
        `CPF: ${val("cpf")}%0A` +
        `NASCIMENTO: ${val("nascimento")}%0A` +
        `TEL: ${val("telefone")}%0A` +
        `WHATSAPP: ${val("whatsapp_cliente")}%0A` +
        `EMAIL: ${val("email")}%0A%0A` +
        `` +
        `*LOCALIZAÇÃO:*%0A` +
        `ENDEREÇO: ${val("endereco")}%0A` +
        `BAIRRO: ${val("bairro")}%0A` +
        `CEP: ${val("cep")}%0A%0A` +
        `` +
        `*FINANCEIRO:*%0A` +
        `VENCIMENTO: Dia ${val("vencimento")}%0A` +
        `MENSALIDADE: ${val("mensalidade")}%0A` +
        `INSTALAÇÃO: ${val("instalacao")}%0A%0A` +
        `` +
        `*DADOS DO VEÍCULO:*%0A` +
        `MODELO: ${val("veiculo")}%0A` +
        `ANO: ${val("ano")}%0A` +
        `PLACA: ${val("placa").toUpperCase()}%0A` +
        `COR: ${val("cor")}%0A%0A` +
        ``;
      window.open(
        `https://api.whatsapp.com/send?phone=${fone}&text=${msg}`,
        "_blank",
      );
    }
  });
});
