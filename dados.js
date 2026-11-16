

document.addEventListener("DOMContentLoaded", function () {

    const opcoes = document.querySelectorAll(".opcao-conta");
    const abas = document.querySelectorAll(".conteudo-aba");

    function abrirAba(nome) {

        opcoes.forEach(function (opcao) {
            opcao.classList.remove("ativa");
        });

        abas.forEach(function (aba) {
            aba.classList.remove("ativo");
        });

        const botao = document.querySelector(
            '.opcao-conta[data-aba="' + nome + '"]'
        );

        const conteudo = document.getElementById("aba-" + nome);

        if (botao && conteudo) {
            botao.classList.add("ativa");
            conteudo.classList.add("ativo");
        }
    }

    opcoes.forEach(function (opcao) {

        opcao.addEventListener("click", function () {
            abrirAba(opcao.dataset.aba);
        });

    });



    document.querySelectorAll("[data-ir-dados]").forEach(function (botao) {

        botao.addEventListener("click", function () {
            abrirAba("dados");
        });

    });



    const emailAtivo = localStorage.getItem("laBellaUsuarioAtivo");

    const chaveDados = emailAtivo
        ? "laBellaDadosCliente_" + encodeURIComponent(emailAtivo)
        : "laBellaDadosCliente_visitante";

    const campos = {
        nome: document.getElementById("nomeCompleto"),
        email: document.getElementById("emailDados"),
        telefone: document.getElementById("telefoneDados"),
        cep: document.getElementById("cepDados"),
        bairro: document.getElementById("bairroDados"),
        endereco: document.getElementById("enderecoDados"),
        cidade: document.getElementById("cidadeDados"),
        estado: document.getElementById("estadoDados")
    };

    const dadosSalvos = JSON.parse(
    localStorage.getItem(chaveDados) || "{}"
);


const contas = JSON.parse(
    localStorage.getItem("laBellaContas") || "{}"
);

const contaCadastro = emailAtivo
    ? contas[emailAtivo.trim().toLowerCase()]
    : null;


    campos.nome.value =
    dadosSalvos.nome || contaCadastro?.nome || "";

    campos.email.value =
    dadosSalvos.email || contaCadastro?.email || emailAtivo || "";

    campos.telefone.value =
    dadosSalvos.telefone || contaCadastro?.telefone || "";

    campos.cep.value = dadosSalvos.cep || "";
    campos.bairro.value = dadosSalvos.bairro || "";
    campos.endereco.value = dadosSalvos.endereco || "";
    campos.cidade.value = dadosSalvos.cidade || "";
    campos.estado.value = dadosSalvos.estado || "";

    Object.keys(campos).forEach(function (campo) {
        if (campos[campo]) {
            campos[campo].value = dadosSalvos[campo] || "";
        }
    });

    if (campos.email && !campos.email.value) {
        campos.email.value = emailAtivo || "";
    }


    // SALVAR DADOS

    const formulario = document.getElementById("formMeusDados");

    if (formulario) {

        formulario.addEventListener("submit", function (event) {

            event.preventDefault();

            const dados = {};

            Object.keys(campos).forEach(function (campo) {
                dados[campo] = campos[campo]
                    ? campos[campo].value.trim()
                    : "";
            });

            localStorage.setItem(chaveDados, JSON.stringify(dados));

            document.getElementById("mensagemDados").textContent =
                "Seus dados foram salvos com sucesso!";

            atualizarEndereco();

        });

    }



    function atualizarEndereco() {

        const resumo = document.getElementById("enderecoResumo");

        if (!resumo) return;

        const partes = [
            campos.endereco.value,
            campos.bairro.value,
            campos.cidade.value,
            campos.estado.value,
            campos.cep.value
        ].filter(Boolean);

        resumo.textContent = partes.length
            ? partes.join(" · ")
            : "Nenhum endereço cadastrado.";

    }

    atualizarEndereco();



    if (campos.telefone) {

        campos.telefone.addEventListener("input", function () {

            let numero = this.value.replace(/\D/g, "").slice(0, 11);

            if (numero.length > 10) {
                numero = numero.replace(
                    /^(\d{2})(\d{5})(\d{4})$/,
                    "($1) $2-$3"
                );
            } else if (numero.length > 6) {
                numero = numero.replace(
                    /^(\d{2})(\d{4})(\d{0,4})$/,
                    "($1) $2-$3"
                );
            } else if (numero.length > 2) {
                numero = numero.replace(
                    /^(\d{2})(\d{0,5})$/,
                    "($1) $2"
                );
            }

            this.value = numero;

        });

    }



    if (campos.cep) {

        campos.cep.addEventListener("input", function () {

            let cep = this.value.replace(/\D/g, "").slice(0, 8);

            if (cep.length > 5) {
                cep = cep.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
            }

            this.value = cep;

        });

    }



    const formularioSenha = document.getElementById("formAlterarSenha");

    if (formularioSenha) {

        formularioSenha.addEventListener("submit", function (event) {

            event.preventDefault();

            const atual = document.getElementById("senhaAtual").value;
            const nova = document.getElementById("novaSenha").value;
            const confirmar = document.getElementById("confirmarNovaSenha").value;
            const mensagem = document.getElementById("mensagemSenha");

            if (nova.length < 6) {
                mensagem.textContent = "A nova senha precisa ter pelo menos 6 caracteres.";
                return;
            }

            if (nova !== confirmar) {
                mensagem.textContent = "As senhas não coincidem.";
                return;
            }

            if (atual === nova) {
                mensagem.textContent = "Escolha uma senha diferente da atual.";
                return;
            }

            mensagem.textContent =
                "A alteração real da senha precisa ser conectada ao sistema de contas.";

        });

    }

});
