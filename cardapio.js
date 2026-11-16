const extensoes = [
    ".png", ".PNG",
    ".jpg", ".JPG",
    ".jpeg", ".JPEG",
    ".webp", ".WEBP",
    ".svg", ".SVG"
];

document.querySelectorAll("img[data-imagem]").forEach((img) => {

    const nome = img.dataset.imagem;
    let indice = 0;

    function tentarImagem() {

        if (indice >= extensoes.length) {
            console.warn("Imagem não encontrada:", nome);
            return;
        }

        img.src = "Imagens/" + nome + extensoes[indice];
        indice++;

    }

    img.addEventListener("error", tentarImagem);
    tentarImagem();

});



const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menuNavegacao");

if (menuBtn && menu) {

    menuBtn.addEventListener("click", () => {

        menu.classList.toggle("aberto");

    });

    menu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            menu.classList.remove("aberto");

        });

    });

}



const temaBtn = document.getElementById("temaBtn");

function definirTema(tema) {

    document.body.classList.toggle(
        "modo-escuro",
        tema === "escuro"
    );

    localStorage.setItem("temaLaBella", tema);

}

definirTema(localStorage.getItem("temaLaBella") || "claro");

if (temaBtn) {

    temaBtn.addEventListener("click", () => {

        const escuro = document.body.classList.contains("modo-escuro");

        definirTema(escuro ? "claro" : "escuro");

    });

}



const revelar = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver((entradas, obs) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visivel");

                obs.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revelar.forEach(item => observador.observe(item));

} else {

    revelar.forEach(item => item.classList.add("visivel"));

}



const buscaPizza = document.getElementById("buscaPizza");

const filtros = document.querySelectorAll(".filtro");

const pizzas = document.querySelectorAll(".pizza");

const semResultado = document.getElementById("semResultado");

let categoriaSelecionada = "todas";



function atualizarCardapio() {

    const termo = buscaPizza.value.toLowerCase().trim();

    let total = 0;

    pizzas.forEach(card => {

        const nome = card.dataset.nome.toLowerCase();

        const categoria = card.dataset.categoria;

        const correspondeNome = nome.includes(termo);

        const correspondeCategoria =
            categoriaSelecionada === "todas" ||
            categoria === categoriaSelecionada;

        const aparece = correspondeNome && correspondeCategoria;

        card.hidden = !aparece;

        if (aparece) {
            total++;
        }

    });

    semResultado.hidden = total > 0;

}



if (buscaPizza) {

    buscaPizza.addEventListener("input", atualizarCardapio);

}



filtros.forEach(botao => {

    botao.addEventListener("click", () => {

        filtros.forEach(filtro => {
            filtro.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        categoriaSelecionada = botao.dataset.filtro;

        atualizarCardapio();

    });

});




document.querySelectorAll(".adicionar-carrinho").forEach(botao => {

    botao.addEventListener("click", (evento) => {

        evento.preventDefault();

        const nome = botao.dataset.nome;
        const preco = Number(botao.dataset.preco);

        let carrinho = JSON.parse(
            localStorage.getItem("laBellaCarrinho")
        ) || [];

        const produtoExistente = carrinho.find(
            produto => produto.nome === nome
        );

        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });

        }

        localStorage.setItem(
            "laBellaCarrinho",
            JSON.stringify(carrinho)
        );

        window.location.href = "carrinho.html";

    });

});
