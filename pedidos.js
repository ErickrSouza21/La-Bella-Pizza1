


const CHAVE_USUARIO_ATIVO = "laBellaUsuarioAtivo";

const TEMPO_PREPARO = 3 * 60 * 1000;
const TEMPO_ENTREGA = 3 * 60 * 1000;
const TEMPO_REMOCAO = 3 * 60 * 1000;

const listaPedidos = document.getElementById("listaPedidos");
const busca = document.getElementById("buscaPedido");
const filtro = document.getElementById("filtroStatus");
const semPedidos = document.getElementById("semPedidos");

const modal = document.getElementById("modalPedido");
const tituloModal = document.getElementById("tituloModal");
const conteudoModal = document.getElementById("conteudoModal");

let pedidosAtuais = [];


function obterChavePedidos() {
    const email = (
        localStorage.getItem(CHAVE_USUARIO_ATIVO) || ""
    ).trim().toLowerCase();

    return email ? `laBellaPedidos_${email}` : null;
}


function carregarPedidos() {
    const chave = obterChavePedidos();

    if (!chave) return [];

    try {
        return JSON.parse(localStorage.getItem(chave)) || [];
    } catch {
        return [];
    }
}


function salvarPedidos(pedidos) {
    const chave = obterChavePedidos();

    if (!chave) return;

    localStorage.setItem(chave, JSON.stringify(pedidos));
}


function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escaparTexto(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}


function obterStatus(pedido) {

    const agora = Date.now();

    const tempoDecorrido = agora - pedido.criadoEm;

    if (tempoDecorrido < TEMPO_PREPARO) {
        return {
            codigo: "preparo",
            nome: "Em preparo",
            proximaMudanca: pedido.criadoEm + TEMPO_PREPARO
        };
    }

    if (tempoDecorrido < TEMPO_PREPARO + TEMPO_ENTREGA) {
        return {
            codigo: "pronto",
            nome: "Pedido pronto",
            proximaMudanca:
                pedido.criadoEm + TEMPO_PREPARO + TEMPO_ENTREGA
        };
    }

    return {
        codigo: "entregue",
        nome: "Entregue",
        proximaMudanca:
            pedido.criadoEm +
            TEMPO_PREPARO +
            TEMPO_ENTREGA +
            TEMPO_REMOCAO
    };
}


function formatarTempo(milissegundos) {

    const segundos = Math.max(
        0,
        Math.ceil(milissegundos / 1000)
    );

    const minutos = Math.floor(segundos / 60);
    const restante = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(restante).padStart(2, "0")}`;
}


function obterPedidosFiltrados() {

    const termo = busca.value.toLowerCase().trim();
    const statusEscolhido = filtro.value;

    return pedidosAtuais.filter(pedido => {

        const status = obterStatus(pedido);

        const numeroCorresponde =
            pedido.id.toLowerCase().includes(termo);

        const statusCorresponde =
            statusEscolhido === "todos" ||
            status.codigo === statusEscolhido;

        return numeroCorresponde && statusCorresponde;
    });
}


function atualizarPedidos() {

    const agora = Date.now();

    pedidosAtuais = carregarPedidos();

    

    pedidosAtuais = pedidosAtuais.filter(pedido => {

        const tempoFinal =
            pedido.criadoEm +
            TEMPO_PREPARO +
            TEMPO_ENTREGA +
            TEMPO_REMOCAO;

        return agora < tempoFinal;
    });

    salvarPedidos(pedidosAtuais);

    const filtrados = obterPedidosFiltrados();

    listaPedidos.innerHTML = filtrados.map(pedido => {

        const status = obterStatus(pedido);

        const tempoRestante =
            status.proximaMudanca - agora;

        const quantidadeItens = pedido.itens.reduce(
            (total, item) => total + item.quantidade,
            0
        );

        const data = new Date(pedido.criadoEm).toLocaleString(
            "pt-BR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );

        let textoTempo = "";

        if (status.codigo === "entregue") {
            textoTempo = "Remoção em: ";
        } else {
            textoTempo = "Próxima atualização em: ";
        }

        return `
            <article class="pedido"
                data-numero="${escaparTexto(pedido.id)}"
                data-status="${status.codigo}">

                <div class="pedido-topo">

                    <div>
                        <strong>Pedido ${escaparTexto(pedido.id)}</strong>
                        <small>${data}</small>
                    </div>

                    <span class="status ${status.codigo}">
                        ${status.nome}
                    </span>

                </div>

                <div class="pedido-baixo">

                    <p>
                        ${quantidadeItens} itens
                        <strong>${formatarMoeda(pedido.total)}</strong>
                    </p>

                    <small class="tempo-pedido">
                        ${textoTempo}${formatarTempo(tempoRestante)}
                    </small>

                    <button
                        class="detalhes"
                        type="button"
                        data-id="${escaparTexto(pedido.id)}">

                        Ver detalhes

                    </button>

                </div>

            </article>
        `;

    }).join("");

    semPedidos.hidden = filtrados.length > 0;

    if (!obterChavePedidos()) {
        semPedidos.textContent =
            "Entre na sua conta para acompanhar seus pedidos.";
    } else if (pedidosAtuais.length === 0) {
        semPedidos.textContent =
            "Você ainda não possui pedidos.";
    } else {
        semPedidos.textContent =
            "Nenhum pedido encontrado.";
    }
}



busca.addEventListener("input", atualizarPedidos);
filtro.addEventListener("change", atualizarPedidos);



listaPedidos.addEventListener("click", evento => {

    const botao = evento.target.closest(".detalhes");

    if (!botao) return;

    const pedido = pedidosAtuais.find(
        item => item.id === botao.dataset.id
    );

    if (!pedido) return;

    const status = obterStatus(pedido);

    tituloModal.textContent = `Pedido ${pedido.id}`;

    let html = `
        <p><strong>Status:</strong> ${status.nome}</p>

        <ul class="itens-modal">
    `;

    pedido.itens.forEach(item => {

        html += `
            <li>
                <span>
                    ${escaparTexto(item.nome)}
                    (${item.quantidade}x)
                </span>

                <strong>
                    ${formatarMoeda(item.preco * item.quantidade)}
                </strong>
            </li>
        `;

    });

    html += `
        </ul>

        <div class="total-modal">
            <span>Total</span>
            <span>${formatarMoeda(pedido.total)}</span>
        </div>
    `;

    conteudoModal.innerHTML = html;

    modal.showModal();
});


function fecharModal() {
    modal.close();
}

document.getElementById("fecharModal")
    .addEventListener("click", fecharModal);

document.getElementById("okModal")
    .addEventListener("click", fecharModal);


atualizarPedidos();

setInterval(atualizarPedidos, 1000);
