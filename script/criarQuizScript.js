const ENDERECO_POST_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"

const criarQuizzButton = document.querySelector(".criar-quiz button");
const criarQuizzIcon = document.querySelector(".topo-seus-quizes ion-icon");
const formInicioCriacaoQuizz = document.querySelector(".inicio-criacao form");
let formCriacaoPerguntas = null;
let formCriacaoNiveis = null;
let prosseguirParaPerguntasButton = null;
let prosseguirParaNiveisButton = null;
let finalizarCriacaoQuizzButton = null;

let infoBasicas = {};
let perguntasCriadas = [];
let niveisCriados = [];
let quizzObjetoCriado = {};
let meusQuizzes = [];

let meusQuizzSerializado = localStorage.getItem("quizzes");
if (meusQuizzSerializado !== null){
    meusQuizzes = JSON.parse(meusQuizzSerializado);
}

function iniciarCriarQuizz(event) {
    document.querySelector("main").classList.add("escondido");
    document.querySelector(".inicio-criacao form").innerHTML = `
        <div class="informacao-quizz">
            <input type="text" class="nome-titulo" name="nome-titulo" minlength="20" maxlength="65" placeholder="Título de seu quizz" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" required>
            <input type="url" class="url" name="url" placeholder="URL da imagem do seu quizz" required>
            <input type="number" class="quantidade-perguntas" name="quantidade-perguntas" min="3" placeholder="Quantidade de perguntas do quizz" required>
            <input type="number" class="quantidade-niveis" name="quantidade-niveis" min="2" placeholder="Quantidade de níveis do quizz" required>
        </div>
        <input type="submit" class="prosseguir-perguntas" name="prosseguir-perguntas" value="Prosseguir para criar perguntas">`;
    document.querySelector(".inicio-criacao").classList.remove("escondido");

    prosseguirParaPerguntasButton = document.querySelector(".prosseguir-perguntas");
    prosseguirParaPerguntasButton.addEventListener("click", () => {
        const listaInputsInvalidos = formInicioCriacaoQuizz.querySelectorAll(":invalid");
        // console.log(list);
        if (listaInputsInvalidos.length !== 0) {
            alert("Preencha os dados corretamente");
        }
    });
}

criarQuizzButton.addEventListener("click", iniciarCriarQuizz);
criarQuizzIcon.addEventListener("click", iniciarCriarQuizz);

formInicioCriacaoQuizz.addEventListener("submit", event => {
    event.preventDefault();
    const titulo = document.querySelector(".nome-titulo");
    const url = document.querySelector(".url");
    const qtdPerguntas = document.querySelector(".quantidade-perguntas");
    const qtdNiveis = document.querySelector(".quantidade-niveis");
    infoBasicas = {
        titulo: titulo.value,
        url: url.value,
        qtdPerguntas: qtdPerguntas.value,
        qtdNiveis: qtdNiveis.value
    };
    document.querySelector(".inicio-criacao").classList.add("escondido");
    abrirEdicaoPerguntas(infoBasicas.qtdPerguntas);
});

function invalidMsg(element) {
    element.setCustomValidity('');
}

function abrirEdicaoPerguntas(qtdPerguntas) {
    formCriacaoPerguntas = document.querySelector(".criacao-perguntas form");
    formCriacaoPerguntas.innerHTML = `
        <div class="cria-pergunta">
            <div class="topo-form">
                <h2>Pergunta 1</h2>
                <img src="imagens/Vector.svg" class="escondido" alt="">
            </div>
            <div class="campo-form-pergunta">
                <div class="definicao-pergunta">
                    <input type="text" class="texto-pergunta" name="texto-pergunta" minlength="20" placeholder="Texto da pergunta" required>
                    <input type="text" class="cor-fundo" name="cor-fundo" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" placeholder="Cor de fundo da pergunta" required>
                </div>
                <h3>Resposta correta</h3>
                <input type="text" class="resposta-correta" name="resposta-correta" placeholder="Resposta correta" required>
                <input type="url" class="url-resposta-correta" name="url-resposta-correta" placeholder="URL da imagem" required>
                <h4>Respostas incorretas</h3>
                <input type="text" class="resposta-incorreta" name="resposta-incorreta1" placeholder="Resposta incorreta 1" required>
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta1" placeholder="URL da imagem 1" required>
                <input type="text" class="resposta-incorreta" name="resposta-incorreta2" placeholder="Resposta incorreta 2">
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta2" placeholder="URL da imagem 2">
                <input type="text" class="resposta-incorreta" name="resposta-incorreta3" placeholder="Resposta incorreta 3">
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta"  placeholder="URL da imagem 3">
            </div>
        </div>`;
    
    for (let i = 1; i < qtdPerguntas; i++) {
        formCriacaoPerguntas.innerHTML += `
            <div class="cria-pergunta">
                <div class="topo-form">
                    <h2>Pergunta ${i + 1}</h2>
                    <img src="imagens/Vector.svg" class="" alt="">
                </div>
                <div class="campo-form-pergunta escondido">
                    <div class="definicao-pergunta">
                        <input type="text" class="texto-pergunta" name="texto-pergunta" minlength="20" placeholder="Texto da pergunta" required>
                        <input type="text" class="cor-fundo" name="cor-fundo" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" placeholder="Cor de fundo da pergunta" required>
                    </div>
                    <h3>Resposta correta</h3>
                    <input type="text" class="resposta-correta" name="resposta-correta" placeholder="Resposta correta" required>
                    <input type="url" class="url-resposta-correta" name="url-resposta-correta" placeholder="URL da imagem" required>
                    <h4>Respostas incorretas</h3>
                    <input type="text" class="resposta-incorreta" name="resposta-incorreta1" placeholder="Resposta incorreta 1" required>
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta1" placeholder="URL da imagem 1" required>
                    <input type="text" class="resposta-incorreta" name="resposta-incorreta2" placeholder="Resposta incorreta 2">
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta2" placeholder="URL da imagem 2">
                    <input type="text" class="resposta-incorreta" name="resposta-incorreta3" placeholder="Resposta incorreta 3">
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta"  placeholder="URL da imagem 3">
                </div>
            </div>`;
    }
    formCriacaoPerguntas.innerHTML += `<input type="submit" class="prosseguir-niveis" name="prosseguir-niveis" value="Prosseguir para criar níveis">`;

    const elementoCriacaoPerguntas = document.querySelector(".criacao-perguntas");
    elementoCriacaoPerguntas.classList.remove("escondido");
    const expandirEditorPerguntasButtons = document.querySelectorAll(".criacao-perguntas img");
    for (botao of expandirEditorPerguntasButtons) {
        botao.addEventListener("click", function() {
            this.parentNode.parentNode.querySelector(".campo-form-pergunta").classList.remove("escondido");
            this.classList.add("escondido");
        })
    }

    prosseguirParaNiveisButton = document.querySelector(".prosseguir-niveis");
    configurarButtonProsseguirParaNiveis(prosseguirParaNiveisButton);
}

function configurarButtonProsseguirParaNiveis(button) {
    button.addEventListener("click", () => {
        const listaInputRespostasIncorretas = formCriacaoPerguntas.querySelectorAll(".url-resposta-incorreta");
        // console.log(listaInputRespostasIncorretas);
        for (let i = 0; i < listaInputRespostasIncorretas.length; i++) {
            if (listaInputRespostasIncorretas[i].value) {
                // console.log(listaInputRespostasIncorretas[i]);
                listaInputRespostasIncorretas[i].previousElementSibling.setAttribute("required", "");
            }
        }
        const listaInputsInvalidos = formCriacaoPerguntas.querySelectorAll(":invalid");
        // console.log(listaInputsInvalidos);
        if (listaInputsInvalidos.length !== 0) {
            alert("Preencha os dados corretamente");
        }
    });

    formCriacaoPerguntas.addEventListener("submit", event => {
        event.preventDefault();
        armazenarInformacoesPerguntas();
        abrirEdicaoNiveis(infoBasicas.qtdNiveis);
    })    
}

function armazenarInformacoesPerguntas() {
    const perguntas = document.querySelectorAll(".campo-form-pergunta");
    // let elementoRespostas = null;
    let respostas = [];
    let infoPerguntaTemporario = {};

    for (pergunta of perguntas) {
        infoPerguntaTemporario.title = pergunta.querySelector(".texto-pergunta").value;
        infoPerguntaTemporario.color = pergunta.querySelector(".cor-fundo").value;
        respostas.push({
            text: pergunta.querySelector(".resposta-correta").value,
            image: pergunta.querySelector(".url-resposta-correta").value,
            isCorrectAnswer: true
        });
        elementosRespostasIncorretas = pergunta.querySelectorAll(".resposta-incorreta");
        for (resposta of elementosRespostasIncorretas) {
            if (resposta.value) {
                respostas.push({
                    text: resposta.value,
                    image: resposta.nextElementSibling.value,
                    isCorrectAnswer: false
                });
            }
        }
        infoPerguntaTemporario.answer = respostas;
        respostas = [];
        perguntasCriadas.push({
            title: infoPerguntaTemporario.title,
            color: infoPerguntaTemporario.color,
            answers: infoPerguntaTemporario.answer
        });
    }
}

function abrirEdicaoNiveis(qtdNiveis) {
    formCriacaoNiveis = document.querySelector(".criacao-niveis form");
    formCriacaoNiveis.innerHTML = `
        <div class="cria-nivel">
            <div class="topo-form">
                <h2>Nível 1</h2>
                <img src="imagens/Vector.svg" class="escondido" alt="">
            </div>
            <div class="campo-form-nivel">
                <input type="text" class="titulo-nivel" name="titulo-nivel" minlength="10" placeholder="Título do nível" required>
                <input type="number" class="porcentagem-nivel" name="porcentagem-nivel" min="0" max="100"  placeholder="% de acerto mínima" required>
                <input type="url" class="url-nivel" name="url-nivel" placeholder="URL da imagem do nível" required>
                <textarea class="texto-nivel" name="texto-nivel" minlength="30" placeholder="Descrição do nível"></textarea>
            </div>
        </div>`;
    
    for (let i = 1; i < qtdNiveis; i++){
        formCriacaoNiveis.innerHTML += `
        <div class="cria-nivel">
            <div class="topo-form">
                <h2>Nível ${i + 1}</h2>
                <img src="imagens/Vector.svg" class="" alt="">
            </div>
            <div class="campo-form-nivel escondido">
                <input type="text" class="titulo-nivel" name="titulo-nivel" minlength="10" placeholder="Título do nível" required>
                <input type="number" class="porcentagem-nivel" name="porcentagem-nivel" min="0" max="100" placeholder="% de acerto mínima" required>
                <input type="url" class="url-nivel" name="url-nivel" placeholder="URL da imagem do nível" required>
                <textarea class="texto-nivel" name="texto-nivel" minlength="30" placeholder="Descrição do nível"></textarea>
            </div>
        </div>`;
    }
    formCriacaoNiveis.innerHTML += `<input type="submit" class="prosseguir-finalizar" value="Finalizar Quizz">`;
    document.querySelector(".criacao-perguntas").classList.add("escondido");

    const elementoCriacaoNiveis = document.querySelector(".criacao-niveis");
    elementoCriacaoNiveis.classList.remove("escondido");
    const expandirEditorNiveisButtons = document.querySelectorAll(".criacao-niveis img");
    for (botao of expandirEditorNiveisButtons) {
        botao.addEventListener("click", function() {
            this.parentNode.parentNode.querySelector(".campo-form-nivel").classList.remove("escondido");
            this.classList.add("escondido");
        })
    }

    finalizarCriacaoQuizzButton = document.querySelector(".prosseguir-finalizar");
    configurarButtonFinalizarCriacaoQuiz(finalizarCriacaoQuizzButton);
}

function configurarButtonFinalizarCriacaoQuiz(button) {
    button.addEventListener("click", () => {
        const listaPorcentagemNiveis = formCriacaoNiveis.querySelectorAll(".porcentagem-nivel");
        let contador = 0;
        for (nivel of listaPorcentagemNiveis) {
            // console.log(nivel.value);
            // console.log(contador);
            if (parseInt(nivel.value) === 0){
                contador++;
            }
        }
        if (contador === 0){
            // alert("Uma porcentagem precisa ser 0");
            document.querySelector(".porcentagem-nivel").setCustomValidity("Uma porcentagem precisa ser 0");
        } else {
            document.querySelector(".porcentagem-nivel").setCustomValidity("");
        }
        
        const listaInputsInvalidos = formCriacaoNiveis.querySelectorAll(":invalid");
        // console.log(list);
        if (listaInputsInvalidos.length !== 0) {
            alert("Preencha os dados corretamente");
        }
    });

    formCriacaoNiveis.addEventListener("submit", event => {
        event.preventDefault();
        // console.log("success");
        armazenarInformacoesNiveis();
        criarObjetoQuizParaEnvio();
        console.log(quizzObjetoCriado);
        enviarQuizzParaServidor();
    })
}

function armazenarInformacoesNiveis() {
    const niveis = document.querySelectorAll(".campo-form-nivel");
    for (nivel of niveis) {
        niveisCriados.push({
            title: nivel.querySelector(".titulo-nivel").value,
            image: nivel.querySelector(".url-nivel").value,
            text: nivel.querySelector(".texto-nivel").value,
            minValue: parseInt(nivel.querySelector(".porcentagem-nivel").value)
        });
    }
}

function criarObjetoQuizParaEnvio() {
    quizzObjetoCriado = {
        title: infoBasicas.titulo,
        image: infoBasicas.url,
        questions: perguntasCriadas,
        levels: niveisCriados
    };
    infoBasicas = {};
    perguntasCriadas = [];
    levels = [];
}

function enviarQuizzParaServidor() {
    const requisicao = axios.post(ENDERECO_POST_QUIZZES, quizzObjetoCriado);
    
    requisicao.then(abrirTelaFimCriacao);
    requisicao.catch(mostrarMensagemErro);
}

function mostrarMensagemErro(erro) {
    console.log(erro.response.data);
    console.log(erro.response.status);
}

function abrirTelaFimCriacao(resposta) {
    console.log(resposta.data);
    const objetoResposta = resposta.data;
    
    if (meusQuizzes.length === 0){
        meusQuizzes.push({
            id: objetoResposta.id,
            key: objetoResposta.key
        });
    } else {
        let contador = 0;
        for (quizz of meusQuizzes){
            if (quizz.id === objetoResposta.id){
                contador++;
            }
        }
        if (contador === 0) {
            meusQuizzes.push({
                id: objetoResposta.id,
                key: objetoResposta.key
            });
        }
    }

    meusQuizzSerializado = JSON.stringify(meusQuizzes);
    localStorage.setItem("quizzes", meusQuizzSerializado);

    document.querySelector(".criacao-niveis").classList.add("escondido");
    const telaFimCriacao = document.querySelector(".fim-criacao");
    telaFimCriacao.innerHTML = `
        <h2>Seu quizz está pronto!</h2>
        <div class="quizz" onclick="jogarQuizz(${objetoResposta.id});">
            <img src="${objetoResposta.image}" alt="">
            <div class="cover"></div>
            <p>${objetoResposta.title}</p>
        </div>
        <div class="botoes-fim-criacao-quizz">
            <button class="acessar-quizz" onclick="jogarQuizz(${objetoResposta.id});">Acessar Quizz</button>
            <button class="home-fim">Voltar para home</button>
        </div>`;
    telaFimCriacao.classList.remove("escondido");
       
}