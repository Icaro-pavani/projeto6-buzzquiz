/* --- Variáveis Globais --- */
const ENDERECO_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzID = 0;
let respostasDoQuizz = [];
let indicePergunta = 0;
let quizzLevels = [];
let numeroDePerguntas = 0;
let numeroDeAcertos = 0;
let resultadoFinal = 0;

const ulTodosQuizzes = document.querySelector(".quizzes");
const ulSeusQuizzes = document.querySelector(".seus-quizzes");
const divPerguntasdoQuizzSelecionado = document.querySelector(".corpo-quizz__perguntas");
const divCompilado = document.querySelector(".compilado");


let idMeusQuizzes = [];
let usuarioTemQuizz = false;

/* --- Conjunto de Funções --- */

// Obtem todos os Quizzes que estão na API
function obterTodosOsQuizzes() {
    
    obterIdMeusQuizzes();
    
    const promise = axios.get(ENDERECO_QUIZZES);

    promise.then((response) => {
        const quizzes = response.data;
        ulTodosQuizzes.innerHTML = "";
        ulSeusQuizzes.innerHTML = "";
        quizzes.forEach(renderizarQuizz);

        mostrarCriarQuizz();
    });

    promise.catch((error) => { console(error.response) });
}


// Obtem os Id dos Quizzes presentes no localStorage
function obterIdMeusQuizzes() {
    idMeusQuizzes = meusQuizzes.map(() => {
        for (let i = 0; i < meusQuizzes.length; i++) {
            return meusQuizzes[i].id;
        }
    })
}


// Renderiza um quizz na tela inicial
function renderizarQuizz(quizz) {
    const id = quizz.id;
    const title = quizz.title;
    const imagem = quizz.image;

    ulInnerHTML = `
    <li class="quizz" onclick="jogarQuizz(${id})">
        <img src="${imagem}" alt="${imagem}">
        <div class="cover"></div>
        <p>${title}</p>
    </li> `

    if (idMeusQuizzes.includes(id)) {
        ulSeusQuizzes.innerHTML += ulInnerHTML;

        if (ulSeusQuizzes.classList.contains("escondido")) {
            mostrarSeusQuizzes();
            usuarioTemQuizz = true;
        }

        
    }
    else {
        ulTodosQuizzes.innerHTML += ulInnerHTML;
    }
}

// Mostra a seção seus quizzes e esconde a seção criar-quiz
function mostrarSeusQuizzes () {
    ulSeusQuizzes.classList.remove("escondido");
    document.querySelector(".topo-seus-quizes").classList.remove("escondido");
    document.querySelector(".criar-quiz").classList.add("escondido");
}

function mostrarCriarQuizz () {
    if (!usuarioTemQuizz) {
        document.querySelector(".criar-quiz").classList.remove("escondido");
    }
}


// Função chamada quando o usuário clica em quizz na tela inicial
function jogarQuizz(id) {
    quizzID = id;
    const promise = axios.get(`${ENDERECO_QUIZZES}/${id}`);
    promise.then((response) => {
        esconderElementosDaTelaInicial();
        mostrarTelaDoQuizz();
        divPerguntasdoQuizzSelecionado.innerHTML = "";
        carregarQuizz(response.data);
    })

    promise.catch((error) => { console(error.response) })
}

// Esconde os elementos da tela inicial do site
function esconderElementosDaTelaInicial() {
    const telaInicial = document.querySelector("main");
    telaInicial.classList.add("escondido");
    document.querySelector(".fim-criacao").classList.add("escondido");
}

// Mostra a tela em que o quizz escolhido é carregado
function mostrarTelaDoQuizz() {
    const telaQuizz = document.querySelector(".corpo-quizz");
    telaQuizz.classList.remove("escondido");
}

// Carrega o quizz na tela após usuário decidir jogá-lo
function carregarQuizz(quizz) {

    const titulo = quizz.title;
    const imagem = quizz.image;
    const questoes = quizz.questions;

    quizzLevels = quizz.levels;
    numeroDePerguntas = questoes.length;

    carregarTituloDoQuizz(titulo, imagem);
    questoes.forEach(carregarQuestao);

    // Scroll para o início da página
    window.scrollTo(0, 0);

}

// Carrega o Título e a Imagem principal do Quizz
function carregarTituloDoQuizz(titulo, imagem) {
    const quizzTitulo = document.querySelector(".quiz-titulo");
    quizzTitulo.innerHTML = `
        <div class="cover"></div>
        <img src="${imagem}" alt="${imagem}">
        <p class="titulo">${titulo}</p>
    `
}

// Carrega cada questão do quizz na tela
// É responsável por compôr todo o HTML de cada questão
function carregarQuestao(questao) {

    const titulo = questao.title;
    const cor = questao.color;
    const respostas = questao.answers;

    // Embaralha as respostas
    respostas.sort(comparador);

    // Adiciona a respota a variável global
    respostasDoQuizz.push(respostas);

    // Cria a pergunta no HTML
    divPerguntasdoQuizzSelecionado.innerHTML += `
    <div class="pergunta">
    <h3><span>${titulo}</span></h3>
        <ul class="respostas">
        </ul>
        </div>
        `;

    // Recupera a ultima pergunta adicionada
    const ultimaPergunta = divPerguntasdoQuizzSelecionado.querySelector(".pergunta:last-child");

    // Recupera o h3 da ultima pergunta adicionada e altera a sua cor
    const h3TituloPergunta = ultimaPergunta.querySelector("h3");
    h3TituloPergunta.style.backgroundColor = cor;

    // Recupera a lista ul da ultima pergunta adicionada
    const ultimaListaDeQuestoes = ultimaPergunta.querySelector("ul");

    // Adicionada cada alternativa da pergunta
    for (let i = 0; i < respostas.length; i++) {
        let resposta = respostas[i];
        ultimaListaDeQuestoes.innerHTML += `
        <li class="resposta" onClick="selecionarResposta(this, ${indicePergunta}, ${i})">
        <div class="imagem-resposta">
                <img src="${resposta.image}" alt="${resposta.image}">
            </div>
            <div class="cobertura"></div>
            <p class="texto-resposta">${resposta.text}</p>
            </li>
            `
    }

    // Incrementa o número de respostas carregadas
    indicePergunta += 1;
}

// Define o comportamento da seleção de uma resposta
function selecionarResposta(liRespostaEscolhida, indicePergunta, indiceResposta) {
    const ulRespostas = liRespostaEscolhida.parentNode;
    const liTodasAsRespostas = [...ulRespostas.querySelectorAll("li")];
    const divPergunta = ulRespostas.parentNode;
    const proximaPergunta = divPergunta.nextElementSibling;

    // Verifica se a pergunta já foi respondida
    if (!divPergunta.classList.contains("pergunta-respondida")) {
        divPergunta.classList.add("pergunta-respondida");
        // Marca a resposta escolhida
        liRespostaEscolhida.classList.add("resposta-escolhida");

        // Para cada resposta verifica se é a escolhida
        liTodasAsRespostas.forEach(verificarRespostaEscolhida);

        // Altera a cor das respostas
        alterarCorDasRespostas(respostasDoQuizz[indicePergunta], liTodasAsRespostas);
    }


    // scroll para a proxima pergunta
    if (proximaPergunta != null) {
        setTimeout(() => {
            proximaPergunta.querySelector('h3').scrollIntoView();
        }, 2000);
    }
    else {
        console.log("Não há mais perguntas!!");
    }

    // Avalia se o resultado é correto ou não
    const respostaSelecionada = respostasDoQuizz[indicePergunta][indiceResposta];
    if (respostaSelecionada.isCorrectAnswer) {
        numeroDeAcertos++;
    }

    // Calcula e renderiza o resultado final caso seja a última pergunta.
    if (isUltimaPergunta(indicePergunta)) {
        console.log("É a última pergunta!!");
        resultadoFinal = Math.round((numeroDeAcertos / numeroDePerguntas) * 100);
        setTimeout(renderizarResultadoDoQuizz, 2000);
    }

}

// Adiciona as resposta não escolhida uma opacidade menor (classe respota-nao-escolhida)
function verificarRespostaEscolhida(liResposta) {
    if (!liResposta.classList.contains("resposta-escolhida")) {
        liResposta.classList.add("resposta-nao-escolhida");
    }
}

// Altera a cor da resposta para verde se ela é a correta, 
// caso contrário altera para vermelho
function alterarCorDasRespostas(respostas, liRespostas) {

    for (let i = 0; i < respostas.length; i++) {
        const respostaCorreta = respostas[i].isCorrectAnswer;
        const textoResposta = liRespostas[i].querySelector(".texto-resposta");

        if (respostaCorreta) {
            textoResposta.style.color = "#009C22";
        }
        else {
            textoResposta.style.color = "#FF0B0B";
        }
    }
}

// Renderiza o HTML do resultado do quizz
function renderizarResultadoDoQuizz() {
    const level = levelFinal();

    divCompilado.innerHTML = `
    <h3><span>${resultadoFinal}% de acerto: ${level.title}</span></h3>
    <div class="mensagem">
        <img src="${level.image}" alt="${level.image}">
        <p>${level.text}</p>
    </div>
    `;

    divCompilado.classList.remove("escondido");
    divCompilado.querySelector('h3').scrollIntoView();
}

// Retornal o level final obtido pelo usuário
function levelFinal() {
    let indiceMaiorLevel = 0;
    let maoirPorcentagem = 0;

    for (let i = 0; i < quizzLevels.length; i++) {
        if (resultadoFinal >= quizzLevels[i].minValue
            && quizzLevels[i].minValue >= maoirPorcentagem) {
            indiceMaiorLevel = i;
            maoirPorcentagem = quizzLevels[i].minValue;
        }
    }

    const maiorLevel = quizzLevels[indiceMaiorLevel];

    return maiorLevel;

}

// Avalia se é a ultima pergunta do quizz
function isUltimaPergunta(indicePergunta) {
    if ((indicePergunta + 1) === numeroDePerguntas) {
        return true;
    }

    return false;
}

// Função que reinicia o quizz
function reiniciarQuizz() {
    jogarQuizz(quizzID);

    divCompilado.classList.add("escondido");
    resetarVariaveis();
}

// Reseta todas as variáveis referentes ao cálculo dos resultados
function resetarVariaveis() {
    respostasDoQuizz = [];
    indicePergunta = 0;
    quizzLevels = [];
    numeroDePerguntas = 0;
    numeroDeAcertos = 0;
    resultadoFinal = 0;
}
/* --- Funções Auxiliares --- */
// Comparador: gera um número randômico entre -0.5 e 0.5
function comparador() {
    return Math.random() - 0.5;
}


/* --- Inicialização --- */
obterTodosOsQuizzes();
