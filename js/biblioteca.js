"use strict";

const areaCategorias = document.querySelector("#biblioteca-categorias");
const atalhosCategorias = document.querySelector("#atalhos-categorias");
const anoRodape = document.querySelector("#ano-rodape");
const campoBusca = document.querySelector("#busca-substancia");
const filtroCategoria = document.querySelector("#filtro-categoria");
const botaoLimpar = document.querySelector("#limpar-filtros");
const quantidadeResultados = document.querySelector("#quantidade-resultados");
const rotuloResultados = document.querySelector("#rotulo-resultados");
const mensagemSemResultados = document.querySelector("#mensagem-sem-resultados");

let controlesConfigurados = false;

async function carregarBiblioteca() {
    try {
        const [respostaCategorias, respostaSubstancias] = await Promise.all([
            fetch("dados/categorias.json"),
            fetch("dados/substancias.json")
        ]);

        if (!respostaCategorias.ok || !respostaSubstancias.ok) {
            throw new Error("Não foi possível abrir os arquivos da biblioteca.");
        }

        const [categorias, substancias] = await Promise.all([
            respostaCategorias.json(),
            respostaSubstancias.json()
        ]);

        if (!Array.isArray(categorias) || !Array.isArray(substancias)) {
            throw new Error("Os arquivos JSON não possuem listas válidas.");
        }

        categorias.sort((a, b) => a.ordem - b.ordem);

        preencherFiltroCategorias(categorias, substancias);
        exibirAtalhos(categorias, substancias);
        exibirCategorias(categorias, substancias);
        configurarControles();
        aplicarFiltros();
    } catch (erro) {
        console.error("Erro ao carregar a biblioteca:", erro);
        mostrarErro(erro.message);
    }
}

function exibirAtalhos(categorias, substancias) {
    atalhosCategorias.innerHTML = "";

    categorias.forEach((categoria) => {
        const quantidade = contarSubstanciasDaCategoria(categoria, substancias);
        const link = document.createElement("a");

        link.href = `#${categoria.id}`;
        link.style.setProperty("--cor-categoria", categoria.cor || "#2563eb");
        link.innerHTML = `
            <span class="atalho-cor" aria-hidden="true"></span>
            <span>${escaparHTML(categoria.nome)}</span>
            <strong>${quantidade}</strong>
        `;

        atalhosCategorias.appendChild(link);
    });
}

function exibirCategorias(categorias, substancias) {
    areaCategorias.innerHTML = "";

    categorias.forEach((categoria) => {
        areaCategorias.appendChild(criarSecaoCategoria(categoria, substancias));
    });
}

function criarSecaoCategoria(categoria, substancias) {
    const substanciasDaCategoria = substancias.filter((substancia) =>
        normalizarTexto(substancia.categoria) ===
        normalizarTexto(categoria.chaveSubstancia)
    );

    const secao = document.createElement("section");
    secao.className = "secao-categoria";
    secao.id = categoria.id;
    secao.dataset.categoria = normalizarTexto(categoria.chaveSubstancia);
    secao.style.setProperty("--cor-categoria", categoria.cor || "#2563eb");

    const quantidade = substanciasDaCategoria.length;
    const textoQuantidade = quantidade === 1
        ? "1 perfil disponível"
        : `${quantidade} perfis disponíveis`;

    secao.innerHTML = `
        <header class="cabecalho-categoria">
            <div class="categoria-identificacao">
                <span class="categoria-ordem">
                    ${String(categoria.ordem).padStart(2, "0")}
                </span>

                <div>
                    <span class="categoria-resumo">
                        ${escaparHTML(categoria.resumo)}
                    </span>
                    <h2>${escaparHTML(categoria.nome)}</h2>
                </div>
            </div>

            <span class="categoria-quantidade">${textoQuantidade}</span>
        </header>

        <p class="categoria-explicacao">
            ${escaparHTML(categoria.explicacao)}
        </p>

        <div class="grade-substancias categoria-grade"></div>
    `;

    const grade = secao.querySelector(".categoria-grade");

    if (quantidade === 0) {
        grade.innerHTML = `
            <div class="categoria-vazia">
                <strong>Perfis em preparação</strong>
                <p>As substâncias desta categoria serão adicionadas em breve.</p>
            </div>
        `;
        return secao;
    }

    substanciasDaCategoria.forEach((substancia) => {
        grade.appendChild(criarCardSubstancia(substancia));
    });

    return secao;
}

function contarSubstanciasDaCategoria(categoria, substancias) {
    return substancias.filter((substancia) =>
        normalizarTexto(substancia.categoria) ===
        normalizarTexto(categoria.chaveSubstancia)
    ).length;
}

function criarCardSubstancia(substancia) {
    const artigo = document.createElement("article");
    artigo.className = "card-substancia";
    artigo.style.setProperty("--cor-card", substancia.cor || "#2563eb");

    const textoEfeitos = Array.isArray(substancia.efeitos)
        ? substancia.efeitos.join(" ")
        : "";

    artigo.dataset.busca = normalizarTexto(`
        ${substancia.nome || ""}
        ${substancia.categoria || ""}
        ${substancia.formula || ""}
        ${substancia.resumo || ""}
        ${substancia.descricao || ""}
        ${substancia.mecanismoCurto || ""}
        ${substancia.mecanismo || ""}
        ${textoEfeitos}
    `);

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

function preencherFiltroCategorias(categorias, substancias) {
    filtroCategoria.innerHTML = `
        <option value="todas">Todas as categorias</option>
    `;

    categorias.forEach((categoria) => {
        const quantidade = contarSubstanciasDaCategoria(categoria, substancias);
        const opcao = document.createElement("option");
        opcao.value = categoria.chaveSubstancia;
        opcao.textContent = `${categoria.nome} (${quantidade})`;
        filtroCategoria.appendChild(opcao);
    });
}

function configurarControles() {
    if (controlesConfigurados) {
        return;
    }

    campoBusca.addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
    botaoLimpar.addEventListener("click", limparFiltros);
    controlesConfigurados = true;
}

function aplicarFiltros() {
    const textoPesquisado = normalizarTexto(campoBusca.value);
    const categoriaSelecionada = normalizarTexto(filtroCategoria.value);
    const secoes = document.querySelectorAll(".secao-categoria");

    let totalEncontrado = 0;
    let secoesVisiveis = 0;

    secoes.forEach((secao) => {
        const correspondeCategoria =
            categoriaSelecionada === "todas" ||
            categoriaSelecionada === secao.dataset.categoria;

        const cards = secao.querySelectorAll(".card-substancia");
        const mensagemVazia = secao.querySelector(".categoria-vazia");
        let cardsVisiveis = 0;

        cards.forEach((card) => {
            const correspondeBusca =
                textoPesquisado === "" ||
                card.dataset.busca.includes(textoPesquisado);

            const deveAparecer = correspondeCategoria && correspondeBusca;
            card.hidden = !deveAparecer;

            if (deveAparecer) {
                cardsVisiveis += 1;
            }
        });

        const mostrarCategoriaVazia =
            correspondeCategoria &&
            cards.length === 0 &&
            textoPesquisado === "";

        if (mensagemVazia) {
            mensagemVazia.hidden = !mostrarCategoriaVazia;
        }

        const mostrarSecao =
            correspondeCategoria &&
            (cardsVisiveis > 0 || mostrarCategoriaVazia);

        secao.hidden = !mostrarSecao;

        if (mostrarSecao) {
            secoesVisiveis += 1;
        }

        totalEncontrado += cardsVisiveis;
    });

    quantidadeResultados.textContent = String(totalEncontrado);
    rotuloResultados.textContent = totalEncontrado === 1
        ? "perfil encontrado"
        : "perfis encontrados";

    mensagemSemResultados.hidden = totalEncontrado > 0 || secoesVisiveis > 0;
}

function limparFiltros() {
    campoBusca.value = "";
    filtroCategoria.value = "todas";
    aplicarFiltros();
    campoBusca.focus();
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function mostrarErro(mensagem) {
    atalhosCategorias.innerHTML = "";
    areaCategorias.innerHTML = `
        <div class="mensagem-erro">
            <strong>Não foi possível organizar a biblioteca.</strong>
            <p>${escaparHTML(mensagem)}</p>
            <p>Verifique os arquivos categorias.json e substancias.json.</p>
        </div>
    `;
}

function atualizarAnoRodape() {
    if (anoRodape) {
        anoRodape.textContent =
            `© ${new Date().getFullYear()} NeuroMap — Projeto educacional.`;
    }
}

atualizarAnoRodape();
carregarBiblioteca();
