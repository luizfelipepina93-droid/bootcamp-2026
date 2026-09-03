(() => {
    "use strict";

    const painel = document.querySelector(".quiz-painel");
    const perguntas = Array.from(document.querySelectorAll(".pergunta"));
    const opcoes = document.querySelectorAll(".opcao");
    const resultado = document.querySelector(".resultado");
    const tituloResultado = document.querySelector("#titulo-resultado");
    const descricaoResultado = document.querySelector("#descricao-resultado");
    const linkResultado = resultado?.querySelector(".botao-primario");
    const botaoReiniciar = resultado?.querySelector(".botao-secundario");
    const textoProgresso = document.querySelector(".progresso-informacoes strong");
    const barraProgresso = document.querySelector(".progresso-barra");
    const trilhaProgresso = document.querySelector(".progresso-trilha");

    if (!painel || perguntas.length === 0 || !resultado) {
        return;
    }

    const cursos = {
        ads: {
            titulo: "Análise e Desenvolvimento de Sistemas",
            descricao: "Você demonstra um perfil prático e criativo, com vontade de transformar ideias em soluções digitais funcionais. ADS combina programação, desenvolvimento web e mobile, banco de dados, experiência do usuário e gestão de projetos.",
            destino: "index.html#curso-ads"
        },
        cc: {
            titulo: "Ciência da Computação",
            descricao: "Seu perfil valoriza lógica, fundamentos e a compreensão profunda da tecnologia. Ciência da Computação permite explorar algoritmos, programação, matemática, hardware e arquitetura de computadores.",
            destino: "index.html#curso-cc"
        },
        ciber: {
            titulo: "Cibersegurança e Infraestrutura de Redes",
            descricao: "Você possui um olhar investigativo e atento a riscos. Cibersegurança combina redes, criptografia, proteção de servidores, análise de vulnerabilidades, perícia digital e defesa de ambientes tecnológicos.",
            destino: "index.html#curso-ciber"
        },
        ia: {
            titulo: "Inteligência Artificial",
            descricao: "Você se interessa por padrões, dados e novas formas de resolver problemas. Inteligência Artificial reúne aprendizado de máquina, visão computacional, linguagem natural e tecnologias generativas.",
            destino: "index.html#curso-ia"
        }
    };

    const pontuacao = {
        ads: 0,
        cc: 0,
        ciber: 0,
        ia: 0
    };

    const respostas = [];
    let perguntaAtual = 0;
    let emTransicao = false;

    const rolarParaPainel = () => {
        const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (window.innerWidth <= 820 || painel.getBoundingClientRect().top < 0) {
            painel.scrollIntoView({
                behavior: movimentoReduzido ? "auto" : "smooth",
                block: "start"
            });
        }
    };

    const atualizarProgresso = (posicao, concluido = false) => {
        const percentual = concluido ? 100 : ((posicao + 1) / perguntas.length) * 100;

        if (textoProgresso) {
            textoProgresso.textContent = concluido ? "Concluído" : `${posicao + 1} de ${perguntas.length}`;
        }

        if (barraProgresso) {
            barraProgresso.style.width = `${percentual}%`;
        }

        if (trilhaProgresso) {
            trilhaProgresso.setAttribute("aria-valuenow", String(concluido ? perguntas.length : posicao + 1));
            trilhaProgresso.setAttribute("aria-valuetext", concluido ? "Quiz concluído" : `Pergunta ${posicao + 1} de ${perguntas.length}`);
        }
    };

    const encontrarResultado = () => {
        const maiorPontuacao = Math.max(...Object.values(pontuacao));
        const empatados = Object.keys(pontuacao).filter((curso) => pontuacao[curso] === maiorPontuacao);
        return respostas.find((curso) => empatados.includes(curso)) || empatados[0];
    };

    const animarCelebracao = () => {
        const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (movimentoReduzido) {
            return;
        }

        resultado.querySelector(".resultado-particulas")?.remove();

        const particulas = document.createElement("div");
        const cores = ["#95e3f7", "#00a8e8", "#ffffff", "#0070bb"];
        particulas.className = "resultado-particulas";
        particulas.setAttribute("aria-hidden", "true");

        for (let indice = 0; indice < 22; indice += 1) {
            const particula = document.createElement("span");
            const coluna = (indice % 11) - 5;
            const camada = Math.floor(indice / 11);
            const direcao = camada === 0 ? -1 : 1;

            particula.style.setProperty("--deslocamento-x", `${coluna * 68 + direcao * 22}px`);
            particula.style.setProperty("--deslocamento-y", `${-90 - (indice % 6) * 42 + camada * 36}px`);
            particula.style.setProperty("--rotacao", `${coluna * 62 + indice * 23}deg`);
            particula.style.setProperty("--atraso", `${(indice % 7) * 45}ms`);
            particula.style.setProperty("--duracao", `${1050 + (indice % 5) * 100}ms`);
            particula.style.setProperty("--tamanho", `${5 + (indice % 4) * 2}px`);
            particula.style.setProperty("--cor", cores[indice % cores.length]);
            particulas.appendChild(particula);
        }

        resultado.prepend(particulas);
        window.setTimeout(() => particulas.remove(), 2100);
    };

    const mostrarResultado = () => {
        const cursoEscolhido = encontrarResultado();
        const curso = cursos[cursoEscolhido];

        tituloResultado.textContent = `Seu perfil combina com ${curso.titulo}`;
        descricaoResultado.textContent = curso.descricao;

        if (linkResultado) {
            linkResultado.href = curso.destino;
            linkResultado.textContent = "Conhecer este curso";
        }

        resultado.classList.add("ativo");
        animarCelebracao();
        atualizarProgresso(perguntas.length - 1, true);
        emTransicao = false;
        rolarParaPainel();
        resultado.focus({ preventScroll: true });
    };

    const avancarPergunta = () => {
        perguntas[perguntaAtual].classList.remove("ativa");
        perguntaAtual += 1;

        if (perguntaAtual < perguntas.length) {
            perguntas[perguntaAtual].classList.add("ativa");
            atualizarProgresso(perguntaAtual);
            emTransicao = false;
            rolarParaPainel();
            perguntas[perguntaAtual].querySelector(".opcao")?.focus({ preventScroll: true });
            return;
        }

        mostrarResultado();
    };

    opcoes.forEach((opcao) => {
        opcao.addEventListener("click", () => {
            if (emTransicao) {
                return;
            }

            const curso = opcao.dataset.curso;

            if (!curso || !(curso in pontuacao)) {
                return;
            }

            emTransicao = true;
            pontuacao[curso] += 1;
            respostas.push(curso);
            opcao.classList.add("selecionada");

            perguntas[perguntaAtual].querySelectorAll(".opcao").forEach((botao) => {
                botao.disabled = true;
            });

            window.setTimeout(avancarPergunta, 360);
        });
    });

    botaoReiniciar?.addEventListener("click", () => {
        Object.keys(pontuacao).forEach((curso) => {
            pontuacao[curso] = 0;
        });

        respostas.length = 0;
        perguntaAtual = 0;
        emTransicao = false;

        perguntas.forEach((pergunta, indice) => {
            pergunta.classList.toggle("ativa", indice === 0);
            pergunta.querySelectorAll(".opcao").forEach((opcao) => {
                opcao.disabled = false;
                opcao.classList.remove("selecionada");
            });
        });

        resultado.classList.remove("ativo");
        resultado.querySelector(".resultado-particulas")?.remove();
        atualizarProgresso(0);
        rolarParaPainel();
        perguntas[0].querySelector(".opcao")?.focus({ preventScroll: true });
    });

    resultado.tabIndex = -1;
    atualizarProgresso(0);
})();
