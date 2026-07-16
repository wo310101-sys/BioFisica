"use strict";

const menuLateral = {
    elementos: {},
    substancias: [],

    iniciar() {
        this.criarEstrutura();
        this.selecionarElementos();
        this.configurarEventos();
        this.carregarSubstancias();
    },

    criarEstrutura() {
        const estrutura = document.createElement("div");

        estrutura.innerHTML = `
            <button
                class="aba-menu-lateral"
                id="abrir-menu-lateral"
                type="button"
                aria-label="Abrir central de navegação"
                aria-controls="menu-lateral"
                aria-expanded="false"
            >
                <span class="aba-menu-icone" aria-hidden="true">
                    <i></i><i></i><i></i>
                </span>

                <span class="aba-menu-texto">Explorar</span>
            </button>

            <div
                class="menu-lateral-overlay"
                id="menu-lateral-overlay"
                hidden
            ></div>

            <aside
                class="menu-lateral"
                id="menu-lateral"
                aria-label="Central de navegação do NeuroMap"
                aria-hidden="true"
            >
                <div class="menu-lateral-cabecalho">
                    <a class="menu-lateral-logo" href="index.html">
                        <span class="logo-simbolo">N</span>

                        <span>
                            <strong>NeuroMap</strong>
                            <small>Central de navegação</small>
                        </span>
                    </a>

                    <button
                        class="fechar-menu-lateral"
                        id="fechar-menu-lateral"
                        type="button"
                        aria-label="Fechar central de navegação"
                    >
                        ×
                    </button>
                </div>

                <div class="menu-lateral-conteudo">
                    <section class="grupo-menu-lateral">
                        <span class="grupo-menu-titulo">Visão geral</span>

                        <nav class="links-menu-lateral" aria-label="Seções principais">
                            <a href="index.html#inicio">
                                <span class="link-menu-numero">01</span>
                                <span>
                                    <strong>Início</strong>
                                    <small>Apresentação da plataforma</small>
                                </span>
                            </a>

                            <a href="biblioteca.html">
                                <span class="link-menu-numero">02</span>
                                <span>
                                    <strong>Biblioteca</strong>
                                    <small>Todos os perfis por categoria</small>
                                </span>
                            </a>

                            <a href="index.html#recursos">
                                <span class="link-menu-numero">03</span>
                                <span>
                                    <strong>Recursos</strong>
                                    <small>Mapa, simulação e comparador</small>
                                </span>
                            </a>

                            <a href="index.html#sobre">
                                <span class="link-menu-numero">04</span>
                                <span>
                                    <strong>Sobre</strong>
                                    <small>Objetivo e limites do projeto</small>
                                </span>
                            </a>
                        </nav>
                    </section>

                    <section class="grupo-menu-lateral grupo-biblioteca">
                        <div class="grupo-menu-linha">
                            <span class="grupo-menu-titulo">Todas as substâncias</span>
                            <span class="contador-menu" id="contador-menu-substancias">0</span>
                        </div>

                        <label class="busca-menu-lateral">
                            <span class="sr-only">Pesquisar substância</span>
                            <span aria-hidden="true">⌕</span>

                            <input
                                id="busca-menu-substancia"
                                type="search"
                                placeholder="Pesquisar na biblioteca"
                                autocomplete="off"
                            >
                        </label>

                        <nav
                            class="lista-menu-substancias"
                            id="lista-menu-substancias"
                            aria-label="Lista de substâncias"
                        >
                            <p class="menu-carregando">Carregando biblioteca...</p>
                        </nav>
                    </section>

                    <section class="grupo-menu-lateral">
                        <span class="grupo-menu-titulo">Ferramentas do projeto</span>

                        <div class="atalhos-menu-lateral">
                            <a href="index.html#recursos">
                                <span>Mapa interativo</span>
                                <small>Em construção</small>
                            </a>

                            <a href="index.html#recursos">
                                <span>Simulação neuronal</span>
                                <small>Em desenvolvimento</small>
                            </a>

                            <a href="index.html#recursos">
                                <span>Comparador</span>
                                <small>Planejado</small>
                            </a>
                        </div>
                    </section>
                </div>

                <div class="menu-lateral-rodape">
                    <strong>Uso educativo</strong>
                    <p>
                        O conteúdo não substitui diagnóstico ou orientação médica.
                    </p>
                </div>
            </aside>
        `;

        document.body.appendChild(estrutura);
    },

    selecionarElementos() {
        this.elementos.botaoAbrir =
            document.querySelector("#abrir-menu-lateral");

        this.elementos.botaoFechar =
            document.querySelector("#fechar-menu-lateral");

        this.elementos.menu =
            document.querySelector("#menu-lateral");

        this.elementos.overlay =
            document.querySelector("#menu-lateral-overlay");

        this.elementos.busca =
            document.querySelector("#busca-menu-substancia");

        this.elementos.lista =
            document.querySelector("#lista-menu-substancias");

        this.elementos.contador =
            document.querySelector("#contador-menu-substancias");
    },

    configurarEventos() {
        this.elementos.botaoAbrir.addEventListener(
            "click",
            () => this.abrir()
        );

        this.elementos.botaoFechar.addEventListener(
            "click",
            () => this.fechar()
        );

        this.elementos.overlay.addEventListener(
            "click",
            () => this.fechar()
        );

        this.elementos.busca.addEventListener(
            "input",
            () => this.filtrarSubstancias()
        );

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                this.fechar();
            }
        });

        this.elementos.menu.addEventListener("click", (evento) => {
            const link = evento.target.closest("a");

            if (link) {
                this.fechar();
            }
        });
    },

    abrir() {
        this.elementos.menu.classList.add("menu-lateral-aberto");
        this.elementos.overlay.hidden = false;

        requestAnimationFrame(() => {
            this.elementos.overlay.classList.add("overlay-visivel");
        });

        document.body.classList.add("menu-global-aberto");

        this.elementos.botaoAbrir.setAttribute(
            "aria-expanded",
            "true"
        );

        this.elementos.menu.setAttribute(
            "aria-hidden",
            "false"
        );

        window.setTimeout(() => {
            this.elementos.busca.focus();
        }, 250);
    },

    fechar() {
        if (!this.elementos.menu) {
            return;
        }

        this.elementos.menu.classList.remove("menu-lateral-aberto");
        this.elementos.overlay.classList.remove("overlay-visivel");
        document.body.classList.remove("menu-global-aberto");

        this.elementos.botaoAbrir.setAttribute(
            "aria-expanded",
            "false"
        );

        this.elementos.menu.setAttribute(
            "aria-hidden",
            "true"
        );

        window.setTimeout(() => {
            if (!this.elementos.overlay.classList.contains("overlay-visivel")) {
                this.elementos.overlay.hidden = true;
            }
        }, 220);
    },

    async carregarSubstancias() {
        try {
            const resposta = await fetch("dados/substancias.json");

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar a biblioteca.");
            }

            const dados = await resposta.json();

            if (!Array.isArray(dados)) {
                throw new Error("A biblioteca não contém uma lista válida.");
            }

            this.substancias = dados;
            this.elementos.contador.textContent = String(dados.length);
            this.exibirSubstancias(dados);
        } catch (erro) {
            console.error("Erro no menu lateral:", erro);

            this.elementos.lista.innerHTML = `
                <p class="menu-erro">
                    Não foi possível carregar as substâncias.
                </p>
            `;
        }
    },

    filtrarSubstancias() {
        const termo = this.normalizarTexto(
            this.elementos.busca.value
        );

        const resultados = this.substancias.filter((substancia) => {
            const conteudo = this.normalizarTexto(
                `${substancia.nome} ${substancia.categoria} ${substancia.formula}`
            );

            return conteudo.includes(termo);
        });

        this.exibirSubstancias(resultados);
    },

    exibirSubstancias(substancias) {
        if (substancias.length === 0) {
            this.elementos.lista.innerHTML = `
                <p class="menu-sem-resultados">
                    Nenhuma substância encontrada.
                </p>
            `;

            return;
        }

        const idAtual = new URLSearchParams(
            window.location.search
        ).get("id");

        this.elementos.lista.innerHTML = substancias
            .map((substancia) => {
                const classeAtual = substancia.id === idAtual
                    ? "substancia-menu-atual"
                    : "";

                return `
                    <a
                        class="item-menu-substancia ${classeAtual}"
                        href="substancia.html?id=${encodeURIComponent(substancia.id)}"
                        style="--cor-item-menu: ${this.escaparHTML(substancia.cor || "#2563eb")};"
                    >
                        <span class="marcador-menu-substancia" aria-hidden="true"></span>

                        <span class="dados-menu-substancia">
                            <strong>${this.escaparHTML(substancia.nome)}</strong>
                            <small>${this.escaparHTML(substancia.categoria)}</small>
                        </span>

                        <span class="seta-menu-substancia" aria-hidden="true">→</span>
                    </a>
                `;
            })
            .join("");
    },

    normalizarTexto(valor) {
        return String(valor ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    },

    escaparHTML(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    menuLateral.iniciar();
});
