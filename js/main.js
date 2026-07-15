"use strict";

const listaSubstancias = document.querySelector("#lista-substancias");
const anoRodape = document.querySelector("#ano-rodape");

async function carregarSubstancias() {
    try {
        const resposta = await fetch("dados/substancias.json");

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível carregar os dados. Código: ${resposta.status}`
            );
        }

        const substancias = await resposta.json();

        if (!Array.isArray(substancias)) {
            throw new Error("O arquivo JSON não contém uma lista válida.");
        }

        exibirSubstancias(substancias);
    } catch (erro) {
        console.error("Erro ao carregar substâncias:", erro);

        listaSubstancias.innerHTML = `
            <div class="mensagem-erro">
                <strong>Não foi possível carregar as substâncias.</strong>
                <p>
                    Abra o projeto usando o Live Server e confira
                    se os arquivos estão nas pastas corretas.
                </p>
            </div>
        `;
    }
}

function exibirSubstancias(substancias) {
    listaSubstancias.innerHTML = "";

    const limite =
        Number(listaSubstancias.dataset.limite || 0);

    const substanciasExibidas =
        limite > 0
            ? substancias.slice(0, limite)
            : substancias;

    substanciasExibidas.forEach((substancia) => {
        const card =
            criarCardSubstancia(substancia);

        listaSubstancias.appendChild(card);
    });
}

function criarCardSubstancia(substancia) {
    const artigo = document.createElement("article");

    artigo.className = "card-substancia";

    artigo.style.setProperty(
        "--cor-card",
        substancia.cor || "#1d72f3"
    );

   const efeitos = substancia.efeitos
    .slice(0, 3)
    .map(function (efeito) {
            return `<li>${escaparHTML(efeito)}</li>`;
        })
        .join("");

    artigo.innerHTML = `
        <div class="card-topo">
            <div>
                <span class="categoria">
                    ${escaparHTML(substancia.categoria)}
                </span>

                <h3>
                    ${escaparHTML(substancia.nome)}
                </h3>
            </div>

            <span class="formula">
                ${escaparHTML(substancia.formula)}
            </span>
        </div>

        <p class="card-resumo">
            ${escaparHTML(substancia.resumo)}
        </p>

        <h4>Alguns efeitos</h4>

        <ul class="lista-efeitos">
            ${efeitos}
        </ul>

        <a
            class="botao-card"
            href="substancia.html?id=${encodeURIComponent(substancia.id)}"
        >
            Abrir página detalhada
        </a>
    `;

    return artigo;
}

function escaparHTML(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function atualizarAnoRodape() {
    const anoAtual = new Date().getFullYear();

    anoRodape.textContent =
        `© ${anoAtual} NeuroMap — Projeto educacional.`;
}

atualizarAnoRodape();
carregarSubstancias();