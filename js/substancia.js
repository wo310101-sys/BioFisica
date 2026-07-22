"use strict";

/*
    ELEMENTOS DA PARTE SUPERIOR
*/

const categoriaSubstancia =
    document.querySelector("#categoria-substancia");

const nomeSubstancia =
    document.querySelector("#nome-substancia");

const formulaSubstancia =
    document.querySelector("#formula-substancia");

const resumoSubstancia =
    document.querySelector("#resumo-substancia");


/*
    ELEMENTOS DA FICHA RÁPIDA
*/

const fichaCategoria =
    document.querySelector("#ficha-categoria");

const fichaEfeito =
    document.querySelector("#ficha-efeito");

const fichaMecanismo =
    document.querySelector("#ficha-mecanismo");


/*
    ELEMENTOS DOS BLOCOS DETALHADOS
*/

const descricaoSubstancia =
    document.querySelector("#descricao-substancia");

const listaFontes =
    document.querySelector("#lista-fontes");

const mecanismoSubstancia =
    document.querySelector("#mecanismo-substancia");

const mecanismoSimples =
    document.querySelector("#mecanismo-simples");

const listaEfeitos =
    document.querySelector("#lista-efeitos");

const listaRiscos =
    document.querySelector("#lista-riscos");

const textoAbstinencia =
    document.querySelector("#texto-abstinencia");

const listaAbstinencia =
    document.querySelector("#lista-abstinencia");

const listaInteracoes =
    document.querySelector("#lista-interacoes");

const listaReferencias =
    document.querySelector("#lista-referencias");

const breadcrumbAtual =
    document.querySelector("#breadcrumb-atual");

const metaDescription =
    document.querySelector("#meta-description");


/*
    DESCOBRE QUAL SUBSTÂNCIA FOI ESCOLHIDA
*/

function descobrirSubstanciaEscolhida() {
    const parametros =
        new URLSearchParams(window.location.search);

    return parametros.get("id");
}


/*
    ABRE O ARQUIVO JSON
*/

async function carregarSubstancia() {
    try {
        const idEscolhido =
            descobrirSubstanciaEscolhida();

        if (!idEscolhido) {
            throw new Error(
                "Nenhuma substância foi selecionada."
            );
        }

        const resposta =
            await fetch("dados/substancias.json");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível abrir o arquivo de dados."
            );
        }

        const substancias =
            await resposta.json();

        const substanciaEncontrada =
            substancias.find(function (substancia) {
                return substancia.id === idEscolhido;
            });

        if (!substanciaEncontrada) {
            throw new Error(
                "A substância solicitada não foi encontrada."
            );
        }

        preencherPagina(substanciaEncontrada);

    } catch (erro) {
        console.error(erro);

        mostrarErro(erro.message);
    }
}


/*
    COLOCA OS DADOS NA PÁGINA
*/

function preencherPagina(substancia) {
    document.title =
        `${substancia.nome} | NeuroMap`;

    document.documentElement.style.setProperty(
        "--cor-substancia",
        substancia.cor || "#1d72f3"
    );

    if (breadcrumbAtual) {
        breadcrumbAtual.textContent =
            substancia.nome;
    }

    if (metaDescription) {
        metaDescription.setAttribute(
            "content",
            substancia.resumo
        );
    }

    categoriaSubstancia.textContent =
        substancia.categoria;

    nomeSubstancia.textContent =
        substancia.nome;

    formulaSubstancia.textContent =
        substancia.formula;

    resumoSubstancia.textContent =
        substancia.resumo;


    /*
        FICHA RÁPIDA
    */

    fichaCategoria.textContent =
        substancia.categoria;

    fichaEfeito.textContent =
        substancia.efeitoPredominante;

    fichaMecanismo.textContent =
        substancia.mecanismoCurto;


    /*
        CONTEÚDO DETALHADO
    */

    descricaoSubstancia.textContent =
        substancia.descricao;

    mecanismoSubstancia.textContent =
        substancia.mecanismo;

    mecanismoSimples.textContent =
        substancia.mecanismoSimples;

    textoAbstinencia.textContent =
        substancia.abstinenciaTexto;


    /*
        LISTAS
    */

    preencherLista(
        listaFontes,
        substancia.fontes,
        "As fontes ainda estão sendo preparadas."
    );

    preencherLista(
        listaEfeitos,
        substancia.efeitos,
        "Os efeitos ainda estão sendo preparados."
    );

    preencherLista(
        listaRiscos,
        substancia.riscos,
        "Os riscos ainda estão sendo preparados."
    );

    preencherLista(
        listaAbstinencia,
        substancia.abstinencia,
        "As informações ainda estão sendo preparadas."
    );

    preencherLista(
        listaInteracoes,
        substancia.interacoes,
        "As interações ainda estão sendo preparadas."
    );

    preencherReferencias(
        substancia.referencias
    );
}


/*
    CRIA UMA LISTA AUTOMATICAMENTE
*/

function preencherLista(
    elemento,
    itens,
    mensagemVazia
) {
    elemento.innerHTML = "";

    if (!Array.isArray(itens) || itens.length === 0) {
        const item =
            document.createElement("li");

        item.textContent =
            mensagemVazia;

        elemento.appendChild(item);

        return;
    }

    itens.forEach(function (texto) {
        const item =
            document.createElement("li");

        item.textContent =
            texto;

        elemento.appendChild(item);
    });
}


/*
    CRIA AS REFERÊNCIAS
*/

function preencherReferencias(referencias) {
    listaReferencias.innerHTML = "";

    if (
        !Array.isArray(referencias) ||
        referencias.length === 0
    ) {
        listaReferencias.textContent =
            "As referências ainda estão sendo preparadas.";

        return;
    }

    referencias.forEach(function (referencia) {
        const bloco =
            document.createElement("article");

        bloco.className =
            "referencia-item";

        const link =
            document.createElement("a");

        link.href =
            referencia.url;

        link.textContent =
            referencia.titulo;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

        const explicacao =
            document.createElement("p");

        explicacao.textContent =
            referencia.uso;

        const dominio =
            document.createElement("span");

        dominio.className =
            "referencia-dominio";

        dominio.textContent =
            obterDominio(referencia.url);

        bloco.appendChild(link);
        bloco.appendChild(explicacao);
        bloco.appendChild(dominio);

        listaReferencias.appendChild(bloco);
    });
}


function obterDominio(url) {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return "Fonte externa";
    }
}


/*
    MOSTRA ERROS
*/

function mostrarErro(mensagem) {
    categoriaSubstancia.textContent =
        "Erro";

    nomeSubstancia.textContent =
        "Página indisponível";

    formulaSubstancia.textContent =
        "—";

    resumoSubstancia.textContent =
        mensagem;

    fichaCategoria.textContent =
        "Indisponível";

    fichaEfeito.textContent =
        "Indisponível";

    fichaMecanismo.textContent =
        "Indisponível";

    descricaoSubstancia.textContent =
        "Confira o endereço e o arquivo JSON.";

    mecanismoSubstancia.textContent =
        "Informação indisponível.";

    mecanismoSimples.textContent =
        "Informação indisponível.";

    textoAbstinencia.textContent =
        "Informação indisponível.";

    listaFontes.innerHTML =
        "<li>Dados indisponíveis.</li>";

    listaEfeitos.innerHTML =
        "<li>Dados indisponíveis.</li>";

    listaRiscos.innerHTML =
        "<li>Dados indisponíveis.</li>";

    listaAbstinencia.innerHTML =
        "<li>Dados indisponíveis.</li>";

    listaInteracoes.innerHTML =
        "<li>Dados indisponíveis.</li>";

    listaReferencias.textContent =
        "Referências indisponíveis.";

    if (breadcrumbAtual) {
        breadcrumbAtual.textContent =
            "Página indisponível";
    }
}


/*
    INICIA A PÁGINA
*/

carregarSubstancia();