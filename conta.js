

const abas = document.querySelectorAll("[data-aba]");
const formularioEntrar = document.getElementById("formEntrar");
const formularioCadastro = document.getElementById("formCadastro");

function trocarAba(aba) {

    if (aba === "entrar") {

        formularioEntrar.classList.remove("escondido");
        formularioCadastro.classList.add("escondido");

    } else {

        formularioCadastro.classList.remove("escondido");
        formularioEntrar.classList.add("escondido");

    }

    document.querySelectorAll(".aba-conta").forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.aba === aba
        );
    });

}

abas.forEach(botao => {
    botao.addEventListener("click", () => {
        trocarAba(botao.dataset.aba);
    });
});



document.querySelectorAll(".mostrar-senha").forEach(botao => {

    botao.addEventListener("click", () => {

        const campo = document.getElementById(botao.dataset.senha);

        if (campo.type === "password") {
            campo.type = "text";
            botao.textContent = "Ocultar";
        } else {
            campo.type = "password";
            botao.textContent = "Mostrar";
        }

    });

});



const telefone = document.getElementById("telefoneCadastro");

telefone.addEventListener("input", () => {

    let valor = telefone.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    if (valor.length > 7) {
        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );
    } else if (valor.length > 2) {
        valor = valor.replace(
            /^(\d{2})(\d{0,5}).*/,
            "($1) $2"
        );
    } else if (valor.length > 0) {
        valor = valor.replace(
            /^(\d*)/,
            "($1"
        );
    }

    telefone.value = valor;

});



formularioEntrar.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const mensagem = document.getElementById("mensagemLogin");

    mensagem.textContent =
        "Formulário preenchido! A autenticação ainda precisa ser conectada ao sistema.";

});



formularioCadastro.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const senha = document.getElementById("senhaCadastro").value;
    const confirmar = document.getElementById("confirmarSenha").value;
    const mensagem = document.getElementById("mensagemCadastro");

    if (senha.length < 6) {
        mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
        return;
    }

    if (senha !== confirmar) {
        mensagem.textContent = "As senhas não são iguais.";
        return;
    }

    mensagem.textContent =
        "Cadastro preenchido corretamente! Falta conectar o sistema de contas.";

});



document.getElementById("recuperarSenha").addEventListener("click", () => {

    alert("A recuperação de senha ainda precisa ser conectada ao sistema.");

});





function obterContasLaBella() {
    try {
        return JSON.parse(localStorage.getItem("laBellaContas")) || {};
    } catch {
        return {};
    }
}

function ativarContaLaBella(email) {
    email = email.trim().toLowerCase();

    localStorage.setItem("laBellaUsuarioAtivo", email);

    const chaveVisitante = "laBellaCarrinho_visitante";
    const chaveUsuario = `laBellaCarrinho_${email}`;

    const carrinhoVisitante = JSON.parse(
        localStorage.getItem(chaveVisitante) || "[]"
    );

    const carrinhoUsuario = JSON.parse(
        localStorage.getItem(chaveUsuario) || "[]"
    );

    if (carrinhoVisitante.length > 0) {
        const combinado = [...carrinhoUsuario];

        carrinhoVisitante.forEach(produto => {
            const existente = combinado.find(
                item => item.nome === produto.nome
            );

            if (existente) {
                existente.quantidade += produto.quantidade;
            } else {
                combinado.push(produto);
            }
        });

        localStorage.setItem(chaveUsuario, JSON.stringify(combinado));
        localStorage.removeItem(chaveVisitante);
    }
}



const formularioCadastroNovo = document.getElementById("formCadastro");

if (formularioCadastroNovo) {
    formularioCadastroNovo.addEventListener("submit", () => {
        const nome = document.getElementById("nomeCadastro").value.trim();
        const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
        const telefone = document.getElementById("telefoneCadastro").value.trim();
        const senha = document.getElementById("senhaCadastro").value;
        const confirmar = document.getElementById("confirmarSenha").value;

        if (
            !nome ||
            !email ||
            senha.length < 6 ||
            senha !== confirmar
        ) {
            return;
        }

        const contas = obterContasLaBella();

        if (contas[email]) {
            document.getElementById("mensagemCadastro").textContent =
                "Este e-mail já está cadastrado.";
            return;
        }

        contas[email] = {
            nome,
            email,
            telefone
        };

        localStorage.setItem("laBellaContas", JSON.stringify(contas));

        ativarContaLaBella(email);

        document.getElementById("mensagemCadastro").textContent =
            "Cadastro demonstrativo realizado! Seu carrinho está vinculado a esta conta.";
    });
}



const formularioEntrarNovo = document.getElementById("formEntrar");

if (formularioEntrarNovo) {
    formularioEntrarNovo.addEventListener("submit", () => {
        const email = document.getElementById("emailLogin").value.trim().toLowerCase();
        const senha = document.getElementById("senhaLogin").value;

        if (!email || !senha) return;

        const contas = obterContasLaBella();

        if (!contas[email]) {
            document.getElementById("mensagemLogin").textContent =
                "Não encontramos uma conta com esse e-mail. Faça seu cadastro primeiro.";
            return;
        }

        ativarContaLaBella(email);

        document.getElementById("mensagemLogin").textContent =
            "Acesso demonstrativo realizado! Seu carrinho foi carregado.";
    });
}

