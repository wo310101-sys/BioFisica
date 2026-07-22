"use strict";

const listaCategoriasHome =
    document.querySelector("#lista-categorias-home");

const numeroPerfis =
    document.querySelector("#numero-perfis");

const numeroCategorias =
    document.querySelector("#numero-categorias");

const numeroReferencias =
    document.querySelector("#numero-referencias");

async function carregarCategoriasHome() {
    if (!listaCategoriasHome) {
        return;
    }

    try {
        const respostas = await Promise.all([
            fetch("dados/categorias.json"),
            fetch("dados/substancias.json")
        ]);

        const respostaCategorias = respostas[0];
        const respostaSubstancias = respostas[1];

        if (
            !respostaCategorias.ok ||
            !respostaSubstancias.ok
        ) {
            throw new Error(
                "Não foi possível carregar os arquivos da biblioteca."
            );
        }

        const dados = await Promise.all([
            respostaCategorias.json(),
            respostaSubstancias.json()
        ]);

        const categorias = dados[0];
        const substancias = dados[1];

        if (
            !Array.isArray(categorias) ||
            !Array.isArray(substancias)
        ) {
            throw new Error(
                "Os arquivos JSON não possuem listas válidas."
            );
        }

        categorias.sort(function (
            categoriaA,
            categoriaB
        ) {
            return categoriaA.ordem - categoriaB.ordem;
        });

        exibirCategoriasHome(
            categorias,
            substancias
        );
        atualizarNumerosHome(
            categorias,
            substancias
        );

    } catch (erro) {
        console.error(
            "Erro ao carregar categorias:",
            erro
        );

        listaCategoriasHome.innerHTML = `
            <div class="mensagem-erro">
                <strong>
                    Não foi possível carregar as categorias.
                </strong>

                <p>
                    Verifique os arquivos categorias.json e
                    substancias.json.
                </p>
            </div>
        `;
    }
}

function exibirCategoriasHome(
    categorias,
    substancias
) {
    listaCategoriasHome.innerHTML = "";

    categorias.forEach(function (categoria) {
        const quantidade =
            contarPerfisDaCategoria(
                categoria,
                substancias
            );

        const card =
            criarCardCategoriaHome(
                categoria,
                quantidade
            );

        listaCategoriasHome.appendChild(card);
    });
}

function contarPerfisDaCategoria(
    categoria,
    substancias
) {
    return substancias.filter(function (substancia) {
        return normalizarTextoHome(
            substancia.categoria
        ) === normalizarTextoHome(
            categoria.chaveSubstancia
        );
    }).length;
}

function criarCardCategoriaHome(
    categoria,
    quantidade
) {
    const artigo =
        document.createElement("article");

    artigo.className =
        "card-categoria-home";

    artigo.style.setProperty(
        "--cor-categoria",
        categoria.cor || "#2563eb"
    );

    const textoQuantidade =
        quantidade === 1
            ? "1 perfil disponível"
            : `${quantidade} perfis disponíveis`;

    artigo.innerHTML = `
        <div class="card-categoria-home-topo">
            <span class="numero-categoria-home">
                ${String(
                    categoria.ordem
                ).padStart(2, "0")}
            </span>

            <span class="quantidade-categoria-home">
                ${textoQuantidade}
            </span>
        </div>

        <div class="marcador-categoria-home"></div>

        <h3>
            ${escaparHTMLHome(categoria.nome)}
        </h3>

        <p class="resumo-categoria-home">
            ${escaparHTMLHome(categoria.resumo)}
        </p>

        <p class="explicacao-categoria-home">
            ${escaparHTMLHome(categoria.explicacao)}
        </p>

        <a
            class="link-categoria-home"
            href="biblioteca.html#${encodeURIComponent(
                categoria.id
            )}"
        >
            Ver substâncias
        </a>
    `;

    return artigo;
}
function atualizarNumerosHome(
    categorias,
    substancias
) {
    const totalPerfis =
        substancias.length;

    const totalCategorias =
        categorias.length;

    const totalReferencias =
        substancias.reduce(
            function (total, substancia) {
                const referencias =
                    Array.isArray(
                        substancia.referencias
                    )
                        ? substancia.referencias.length
                        : 0;

                return total + referencias;
            },
            0
        );

    if (numeroPerfis) {
        numeroPerfis.textContent =
            String(totalPerfis);
    }

    if (numeroCategorias) {
        numeroCategorias.textContent =
            String(totalCategorias);
    }

    if (numeroReferencias) {
        numeroReferencias.textContent =
            String(totalReferencias);
    }
}
function normalizarTextoHome(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function escaparHTMLHome(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

carregarCategoriasHome();