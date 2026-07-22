"use strict";

const listaSubstancias = document.querySelector("#lista-substancias");
const anoRodape = document.querySelector("#ano-rodape");
const contadorSubstancias = document.querySelector("#contador-substancias");

async function carregarSubstancias() {
    if (!listaSubstancias) {
        return;
    }

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
        atualizarContador(substancias.length);
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

        atualizarContador(0);
    }
}

function exibirSubstancias(substancias) {
    listaSubstancias.innerHTML = "";

    const limite = Number(listaSubstancias.dataset.limite || 0);
    const substanciasExibidas = limite > 0
        ? substancias.slice(0, limite)
        : substancias;

    substanciasExibidas.forEach((substancia) => {
        listaSubstancias.appendChild(criarCardSubstancia(substancia));
    });
}

function criarCardSubstancia(substancia) {
    const artigo = document.createElement("article");
    artigo.className = "card-substancia";
    artigo.style.setProperty("--cor-card", substancia.cor || "#2563eb");

    const efeitos = Array.isArray(substancia.efeitos)
        ? substancia.efeitos
            .slice(0, 3)
            .map((efeito) => `<li>${escaparHTML(efeito)}</li>`)
            .join("")
        : "<li>Informações em preparação.</li>";

    artigo.innerHTML = `
        <div class="card-topo">
            <div>
                <span class="categoria">${escaparHTML(substancia.categoria)}</span>
                <h3>${escaparHTML(substancia.nome)}</h3>
            </div>
            <span class="formula">${escaparHTML(substancia.formula)}</span>
        </div>

        <p class="card-resumo">${escaparHTML(substancia.resumo)}</p>

        <h4>Efeitos em destaque</h4>
        <ul class="lista-efeitos">${efeitos}</ul>

        <a
            class="botao-card"
            href="substancia.html?id=${encodeURIComponent(substancia.id)}"
        >
            Abrir perfil
        </a>
    `;

    return artigo;
}

function atualizarContador(total) {
    if (contadorSubstancias) {
        contadorSubstancias.textContent = String(total);
    }
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function atualizarAnoRodape() {
    if (!anoRodape) {
        return;
    }

    anoRodape.textContent =
        `© ${new Date().getFullYear()} NeuroMap — Projeto educacional.`;
}

atualizarAnoRodape();
carregarSubstancias();
