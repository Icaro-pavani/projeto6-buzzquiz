/* --- Variáveis Globais --- */
const ENDERECO_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let respostasDoQuizz = [];
let indicePergunta = 0;

const ulQuizzes = document.querySelector(".quizzes");
const divPerguntasdoQuizzSelecionado = document.querySelector(".corpo-quizz__perguntas");

/* --- Conjunto de Funções --- */

// Obtem todos os Quizzes que estão na API
function obterTodosOsQuizzes() {
    const promise = axios.get(ENDERECO_QUIZZES);

    promise.then((response) => {
        const quizzes = response.data;
        ulQuizzes.innerHTML = "";
        quizzes.forEach(renderizarQuizz);
    });

    promise.catch((error) => { console(error.response) });
}

// Renderiza um quizz na tela inicial
function renderizarQuizz(quizz) {
    const id = quizz.id;
    const title = quizz.title;
    const imagem = quizz.image;

    ulQuizzes.innerHTML += `
    <li class="quizz" onclick="jogarQuizz(${id})">
        <img src="${imagem}" alt="${imagem}">
        <div class="cover"></div>
        <p>${title}</p>
    </li> `
}

// Função chamada quando o usuário clica em quizz na tela inicial
function jogarQuizz(id) {
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

    carregarTituloDoQuizz(titulo, imagem);
    questoes.forEach(carregarQuestao);
}

// Carrega o Título e a Imagem principal do Quizz
function carregarTituloDoQuizz(titulo, imagem) {
    const quizzTitulo = document.querySelector(".quiz-titulo");
    quizzTitulo.innerHTML = `
        <div class="cover"></div>
        <img src="${imagem}" alt="${imagem}">
        <p class="titulo">${titulo}</p>
    `
    quizzTitulo.scrollIntoView();
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

function selecionarResposta(liRespostaEscolhida, indicePergunta, indiceResposta) {
    const ulRespostas = liRespostaEscolhida.parentNode;
    const todasAsRespostas = [...ulRespostas.querySelectorAll("li")];
    const divPergunta = ulRespostas.parentNode;

    if (!divPergunta.classList.contains("pergunta-respondida")) {
        divPergunta.classList.add("pergunta-respondida");
        // Marca a resposta escolhida
        liRespostaEscolhida.classList.add("resposta-escolhida");

        // Para cada resposta verifica se é a escolhida
        todasAsRespostas.forEach(verificarRespostaEscolhida);
    }
    

    const respostaSelecionada = respostasDoQuizz[indicePergunta][indiceResposta];
}

// Adiciona as resposta não escolhida uma opacidade menor (classe respota-nao-escolhida)
function verificarRespostaEscolhida(liResposta) {
    if (!liResposta.classList.contains("resposta-escolhida")) {
        liResposta.classList.add("resposta-nao-escolhida");
    }
}

/* --- Funções Auxiliares --- */
// Comparador: gera um número randômico entre -0.5 e 0.5
function comparador() {
    return Math.random() - 0.5;
}

/* --- Inicialização --- */
obterTodosOsQuizzes();
