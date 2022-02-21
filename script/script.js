/* --- Variáveis Globais --- */
const ENDERECO_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzID = 0;
let respostasDoQuizz = [];
let indicePergunta = 0;
let quizzLevels = [];
let perguntasRespondidas = null;
let numeroDePerguntas = 0;
let numeroDeAcertos = 0;
let numeroDeRespostasDadas = 0;
let resultadoFinal = 0;

const ulTodosQuizzes = document.querySelector(".quizzes");
const ulSeusQuizzes = document.querySelector(".seus-quizzes");
const divPerguntasdoQuizzSelecionado = document.querySelector(".corpo-quizz__perguntas");
const divCompilado = document.querySelector(".compilado");
const divBotoesFimQuizz = document.querySelector(".botoes-fim-quizz");

let idMeusQuizzes = [];
let usuarioTemQuizz = false;

/* --- Conjunto de Funções --- */

function obterTodosOsQuizzes() {

    obterIdMeusQuizzes();

    const promise = axios.get(ENDERECO_QUIZZES);

    promise.then((response) => {
        toggleTelaLoading();
        const telaInicial = document.querySelector("main");
        telaInicial.classList.remove("escondido");
        const quizzes = response.data;
        ulTodosQuizzes.innerHTML = "";
        ulSeusQuizzes.innerHTML = "";
        quizzes.forEach(renderizarQuizz);

        mostrarCriarQuizz();
    });

    promise.catch((error) => { console(error.response) });
}


function obterIdMeusQuizzes() {
    idMeusQuizzes = meusQuizzes.map(quizz => quizz.id);
}


function renderizarQuizz(quizz) {
    const id = quizz.id;
    const title = quizz.title;
    const imagem = quizz.image;

    ulInnerHTML = `
    <li class="quizz" onclick="jogarQuizz(${id})" data-identifier="quizz-card">
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


function mostrarSeusQuizzes() {
    ulSeusQuizzes.classList.remove("escondido");
    document.querySelector(".topo-seus-quizes").classList.remove("escondido");
    document.querySelector(".criar-quiz").classList.add("escondido");
}

function mostrarCriarQuizz() {
    if (!usuarioTemQuizz) {
        document.querySelector(".criar-quiz").classList.remove("escondido");
    }
}


function jogarQuizz(id) {
    quizzID = id;
    toggleTelaLoading();
    esconderElementosDaTelaInicial();
    const promise = axios.get(`${ENDERECO_QUIZZES}/${id}`);
    promise.then((response) => {
        divPerguntasdoQuizzSelecionado.innerHTML = "";
        carregarQuizz(response.data);
        mostrarTelaDoQuizz();
        toggleTelaLoading();
    })

    promise.catch((error) => { console(error.response) })
}


function esconderElementosDaTelaInicial() {
    const telaInicial = document.querySelector("main");
    telaInicial.classList.add("escondido");
    document.querySelector(".fim-criacao").classList.add("escondido");
}


function mostrarTelaDoQuizz() {
    const telaQuizz = document.querySelector(".corpo-quizz");
    telaQuizz.classList.remove("escondido");
}


function carregarQuizz(quizz) {

    const titulo = quizz.title;
    const imagem = quizz.image;
    const questoes = quizz.questions;

    quizzLevels = quizz.levels;
    numeroDePerguntas = questoes.length;
    perguntasRespondidas = new Array(numeroDePerguntas).fill(false);

    carregarTituloDoQuizz(titulo, imagem);
    questoes.forEach(carregarQuestao);

    // Scroll para o início da página
    window.scrollTo(0, 0);

}


function carregarTituloDoQuizz(titulo, imagem) {
    const quizzTitulo = document.querySelector(".quiz-titulo");
    quizzTitulo.innerHTML = `
        <div class="cover"></div>
        <img src="${imagem}" alt="${imagem}">
        <p class="titulo">${titulo}</p>
    `
}


function carregarQuestao(questao) {

    const titulo = questao.title;
    const cor = questao.color;
    const respostas = questao.answers;

    // Embaralha as respostas
    respostas.sort(comparador);

    
    respostasDoQuizz.push(respostas);

    // Cria a pergunta no HTML
    divPerguntasdoQuizzSelecionado.innerHTML += `
    <div class="pergunta">
        <h3 data-identifier="question"><span>${titulo}</span></h3>
        <ul class="respostas">
        </ul>
    </div>
        `;

    // Recupera a ultima pergunta adicionada
    const ultimaPergunta = divPerguntasdoQuizzSelecionado.querySelector(".pergunta:last-child");

    
    const h3TituloPergunta = ultimaPergunta.querySelector("h3");
    h3TituloPergunta.style.backgroundColor = cor;

    
    const ultimaListaDeQuestoes = ultimaPergunta.querySelector("ul");

    // Adicionada cada alternativa da pergunta
    for (let i = 0; i < respostas.length; i++) {
        let resposta = respostas[i];
        ultimaListaDeQuestoes.innerHTML += `
        <li class="resposta" onClick="selecionarResposta(this, ${indicePergunta}, ${i})" data-identifier="answer">
            <div class="imagem-resposta">
                <img src="${resposta.image}" alt="${resposta.image}">
            </div>
            <div class="cobertura"></div>
            <p class="texto-resposta">${resposta.text}</p>
        </li>
            `
    }

    
    indicePergunta += 1;
}


function selecionarResposta(liRespostaEscolhida, indicePergunta, indiceResposta) {
    const ulRespostas = liRespostaEscolhida.parentNode;
    const liTodasAsRespostas = [...ulRespostas.querySelectorAll("li")];
    const divPergunta = ulRespostas.parentNode;
    const proximaPergunta = divPergunta.nextElementSibling;

    
    if (!divPergunta.classList.contains("pergunta-respondida") && perguntaAnteriorFoiRespondida(indicePergunta)) {

        numeroDeRespostasDadas++;

        divPergunta.classList.add("pergunta-respondida");
        liRespostaEscolhida.classList.add("resposta-escolhida");

        // Para cada resposta verifica se é a escolhida
        liTodasAsRespostas.forEach(verificarRespostaEscolhida);

        alterarCorDasRespostas(respostasDoQuizz[indicePergunta], liTodasAsRespostas);

        // scroll para a proxima pergunta
        if (proximaPergunta != null) {
            setTimeout(() => {
                proximaPergunta.querySelector('h3').scrollIntoView({ block: "center", inline: "center" });
            }, 2000);
        }

        const respostaSelecionada = respostasDoQuizz[indicePergunta][indiceResposta];
        if (respostaSelecionada.isCorrectAnswer) {
            numeroDeAcertos++;
        }

        // Calcula e renderiza o resultado final caso seja a última pergunta.
        if (isUltimaPergunta()) {
            console.log("É a última pergunta!!");
            resultadoFinal = Math.round((numeroDeAcertos / numeroDePerguntas) * 100);
            setTimeout(renderizarResultadoDoQuizz, 2000);
        }
    }
}

function perguntaAnteriorFoiRespondida(indicePergunta) {
    if (indicePergunta === 0 || perguntasRespondidas[indicePergunta - 1]) {
        perguntasRespondidas[indicePergunta] = true;
        return true;
    }
    alert("Não foi possível selecioar a resposta! Respoda a(s) pergunta(s) anterior(es)!");
    return false;
}


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
    divBotoesFimQuizz.classList.remove("escondido");
    divBotoesFimQuizz.scrollIntoView();
}


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


function isUltimaPergunta() {
    if (numeroDeRespostasDadas === numeroDePerguntas) {
        return true;
    }

    return false;
}


function reiniciarQuizz() {
    divCompilado.classList.add("escondido");
    divBotoesFimQuizz.classList.add("escondido");
    jogarQuizz(quizzID);

    resetarVariaveis();
}


function resetarVariaveis() {
    respostasDoQuizz = [];
    indicePergunta = 0;
    quizzLevels = [];
    numeroDePerguntas = 0;
    numeroDeAcertos = 0;
    resultadoFinal = 0;
    numeroDeRespostasDadas = 0;
}

/* --- Funções Auxiliares --- */
// Comparador: gera um número randômico entre -0.5 e 0.5
function comparador() {
    return Math.random() - 0.5;
}


/* --- Inicialização --- */
obterTodosOsQuizzes();
