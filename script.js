(() => {
    "use strict";

    const chaveTema = "uniteste-tema";
    const corpo = document.body;
    const botoesTema = document.querySelectorAll(".tema-icone-btn");
    const logosTema = document.querySelectorAll("[data-logo-tema]");
    const cabecalho = document.querySelector(".cabecalho");

    const lerTemaSalvo = () => {
        try {
            return localStorage.getItem(chaveTema);
        } catch {
            return null;
        }
    };

    const salvarTema = (tema) => {
        try {
            localStorage.setItem(chaveTema, tema);
        } catch {
            return;
        }
    };

    const aplicarTema = (tema) => {
        const temaClaro = tema === "claro";

        corpo.classList.toggle("tema-claro", temaClaro);
        document.documentElement.style.colorScheme = temaClaro ? "light" : "dark";

        logosTema.forEach((logo) => {
            const origem = temaClaro ? logo.dataset.logoClaro : logo.dataset.logoEscuro;

            if (origem) {
                logo.src = origem;
            }
        });

        botoesTema.forEach((botao) => {
            const icone = botao.querySelector(".tema-icone") || botao.querySelector("span");
            botao.setAttribute("aria-pressed", String(temaClaro));
            botao.setAttribute("aria-label", temaClaro ? "Ativar tema escuro" : "Ativar tema claro");
            botao.title = temaClaro ? "Ativar tema escuro" : "Ativar tema claro";

            if (icone) {
                icone.textContent = temaClaro ? "☾" : "☀";
            }
        });
    };

    let temaAtual = lerTemaSalvo() === "claro" ? "claro" : "escuro";
    aplicarTema(temaAtual);

    botoesTema.forEach((botao) => {
        botao.addEventListener("click", () => {
            temaAtual = corpo.classList.contains("tema-claro") ? "escuro" : "claro";
            aplicarTema(temaAtual);
            salvarTema(temaAtual);
        });
    });

    const atualizarCabecalho = () => {
        if (cabecalho) {
            cabecalho.classList.toggle("rolando", window.scrollY > 16);
        }
    };

    atualizarCabecalho();
    window.addEventListener("scroll", atualizarCabecalho, { passive: true });
})();
