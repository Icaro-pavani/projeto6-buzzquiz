// const ENDERECO_POST_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"

const criarQuizzButton = document.querySelector(".criar-quiz button");
const criarQuizzIcon = document.querySelector(".topo-seus-quizes ion-icon");
const formInicioCriacaoQuizz = document.querySelector(".inicio-criacao form");
const telaLoading = document.querySelector(".loading");
const formCriacaoPerguntas = document.querySelector(".criacao-perguntas form");
const formCriacaoNiveis = document.querySelector(".criacao-niveis form");
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

function eliminarBalaoDialogoErroForms(form) {
    form.addEventListener("invalid", event => {
        event.preventDefault();
    }, true);
}

function criarMensagensInputsInvalidos(inputsInvalidos, inputsValidos, formulario) {
    let mensagemErro;
    // Esconder mensagens de erros existentes
    const textosDeErros = formulario.querySelectorAll("p");
    for (let i = 0; i < textosDeErros.length; i++){
        textosDeErros[i].classList.add("escondido");
    }

    // Deixa o layout padrão para os inputs validos
    if (inputsValidos.length > 1){
        for (let i = 0; i < inputsValidos.length - 1; i++){
            inputsValidos[i].style.backgroundColor = "#fff";
            mensagemErro = inputsValidos[i].nextElementSibling;
            mensagemErro.classList.add("escondido");
        }
    }

    // Adiciona as mensagens de erro de preenchimento abaixo dos inputs
    for (let i = 0; i < inputsInvalidos.length; i++) {
        inputsInvalidos[i].style.backgroundColor = "#ffe9e9";
        mensagemErro = inputsInvalidos[i].nextElementSibling;
        mensagemErro.innerHTML = inputsInvalidos[i].validationMessage;
        mensagemErro.classList.remove("escondido");
    }

    // Foca no primeira campo invalido
    if (inputsInvalidos.length > 0){
        inputsInvalidos[0].focus();
    }
}

function iniciarCriarQuizz() {
    document.querySelector("main").classList.add("escondido");
    document.querySelector(".inicio-criacao form").innerHTML = `
        <div class="informacao-quizz">
            <input type="text" class="nome-titulo" name="nome-titulo" minlength="20" maxlength="65" placeholder="Título de seu quizz" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" required>
            <p class="mensagem-erro escondido"></p>
            <input type="url" class="url" name="url" placeholder="URL da imagem do seu quizz" required>
            <p class="mensagem-erro escondido"></p>
            <input type="number" class="quantidade-perguntas" name="quantidade-perguntas" min="3" placeholder="Quantidade de perguntas do quizz" required>
            <p class="mensagem-erro escondido"></p>
            <input type="number" class="quantidade-niveis" name="quantidade-niveis" min="2" placeholder="Quantidade de níveis do quizz" required>
            <p class="mensagem-erro escondido"></p>
        </div>
        <input type="submit" class="prosseguir-perguntas" name="prosseguir-perguntas" value="Prosseguir pra criar perguntas">`;
    document.querySelector(".inicio-criacao").classList.remove("escondido");

    prosseguirParaPerguntasButton = document.querySelector(".prosseguir-perguntas");
    eliminarBalaoDialogoErroForms(formInicioCriacaoQuizz);
    prosseguirParaPerguntasButton.addEventListener("click", () => {
        const listaInputsInvalidos = formInicioCriacaoQuizz.querySelectorAll(":invalid");
        const listaInputsValidos = formInicioCriacaoQuizz.querySelectorAll(":valid");
        // console.log(list);
        // if (listaInputsInvalidos.length !== 0) {
        //     alert("Preencha os dados corretamente");
        // }

        criarMensagensInputsInvalidos(listaInputsInvalidos, listaInputsValidos, formInicioCriacaoQuizz);
        // let mensagemErro;
        // // Esconder mensagens de erros existentes
        // const textosDeErros = formInicioCriacaoQuizz.querySelectorAll("p");
        // for (let i = 0; i < textosDeErros.length; i++){
        //     textosDeErros[i].classList.add("escondido");
        // }

        // if (listaInputsValidos.length > 1){
        //     for (let i = 0; i < listaInputsValidos.length - 1; i++){
        //         listaInputsValidos[i].style.backgroundColor = "#fff";
        //         mensagemErro = listaInputsValidos[i].nextElementSibling;
        //         mensagemErro.classList.add("escondido");
        //     }
        // }

        // // Adiciona as mensagens de erro de preenchimento abaixo dos inputs
        // for (let i = 0; i < listaInputsInvalidos.length; i++) {
        //     listaInputsInvalidos[i].style.backgroundColor = "#ffe9e9";
        //     mensagemErro = listaInputsInvalidos[i].nextElementSibling;
        //     mensagemErro.innerHTML = listaInputsInvalidos[i].validationMessage;
        //     mensagemErro.classList.remove("escondido");
        // }
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

// formInicioCriacaoQuizz.addEventListener("")

function invalidMsg(element) {
    element.setCustomValidity('');
}

function abrirEdicaoPerguntas(qtdPerguntas) {
    // formCriacaoPerguntas = document.querySelector(".criacao-perguntas form");
    formCriacaoPerguntas.innerHTML = `
        <div class="cria-pergunta">
            <div class="topo-form">
                <h2>Pergunta 1</h2>
                <img src="imagens/Vector.svg" class="escondido" alt="" data-identifier="expand">
            </div>
            <div class="campo-form-pergunta" data-identifier="question">
                <div class="definicao-pergunta">
                    <input type="text" class="texto-pergunta" name="texto-pergunta" minlength="20" placeholder="Texto da pergunta" required>
                    <p class="mensagem-erro escondido"></p>
                    <input type="text" class="cor-fundo" name="cor-fundo" pattern="^#([A-Fa-f0-9]{6})$" placeholder="Cor de fundo da pergunta" required>
                    <p class="mensagem-erro escondido"></p>
                </div>
                <h3>Resposta correta</h3>
                <input type="text" class="resposta-correta" name="resposta-correta" placeholder="Resposta correta" required>
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-resposta-correta" name="url-resposta-correta" placeholder="URL da imagem" required>
                <p class="mensagem-erro escondido"></p>
                <h4>Respostas incorretas</h3>
                <input type="text" class="resposta-incorreta primeira" name="resposta-incorreta1" placeholder="Resposta incorreta 1" required>
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta1" placeholder="URL da imagem 1" required>
                <p class="mensagem-erro escondido"></p>
                <input type="text" class="resposta-incorreta" name="resposta-incorreta2" placeholder="Resposta incorreta 2">
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta2" placeholder="URL da imagem 2">
                <p class="mensagem-erro escondido"></p>
                <input type="text" class="resposta-incorreta" name="resposta-incorreta3" placeholder="Resposta incorreta 3">
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta"  placeholder="URL da imagem 3">
                <p class="mensagem-erro escondido"></p>
            </div>
        </div>`;
    
    for (let i = 1; i < qtdPerguntas; i++) {
        formCriacaoPerguntas.innerHTML += `
            <div class="cria-pergunta">
                <div class="topo-form">
                    <h2>Pergunta ${i + 1}</h2>
                    <img src="imagens/Vector.svg" class="" alt="" data-identifier="expand">
                </div>
                <div class="campo-form-pergunta escondido" data-identifier="question">
                    <div class="definicao-pergunta">
                        <input type="text" class="texto-pergunta" name="texto-pergunta" minlength="20" placeholder="Texto da pergunta" required>
                        <p class="mensagem-erro escondido"></p>
                        <input type="text" class="cor-fundo" name="cor-fundo" pattern="^#([A-Fa-f0-9]{6})$" placeholder="Cor de fundo da pergunta" required>
                        <p class="mensagem-erro escondido"></p>
                    </div>
                    <h3>Resposta correta</h3>
                    <input type="text" class="resposta-correta" name="resposta-correta" placeholder="Resposta correta" required>
                    <p class="mensagem-erro escondido"></p>
                    <input type="url" class="url-resposta-correta" name="url-resposta-correta" placeholder="URL da imagem" required>
                    <p class="mensagem-erro escondido"></p>
                    <h4>Respostas incorretas</h3>
                    <input type="text" class="resposta-incorreta primeira" name="resposta-incorreta1" placeholder="Resposta incorreta 1" required>
                    <p class="mensagem-erro escondido"></p>
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta1" placeholder="URL da imagem 1" required>
                    <p class="mensagem-erro escondido"></p>
                    <input type="text" class="resposta-incorreta" name="resposta-incorreta2" placeholder="Resposta incorreta 2">
                    <p class="mensagem-erro escondido"></p>
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta2" placeholder="URL da imagem 2">
                    <p class="mensagem-erro escondido"></p>
                    <input type="text" class="resposta-incorreta" name="resposta-incorreta3" placeholder="Resposta incorreta 3">
                    <p class="mensagem-erro escondido"></p>
                    <input type="url" class="url-resposta-incorreta" name="url-resposta-incorreta"  placeholder="URL da imagem 3">
                    <p class="mensagem-erro escondido"></p>
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
    eliminarBalaoDialogoErroForms(formCriacaoPerguntas);
    button.addEventListener("click", () => {
        const listaURLRespostasIncorretas = formCriacaoPerguntas.querySelectorAll(".url-resposta-incorreta");
        const listaTextoRespostasIncorretas = formCriacaoPerguntas.querySelectorAll(".resposta-incorreta");

        // console.log(listaInputRespostasIncorretas);
        for (let i = 0; i < listaURLRespostasIncorretas.length; i++) {
            if (listaURLRespostasIncorretas[i].value) {
                // console.log(listaInputRespostasIncorretas[i]);
                listaTextoRespostasIncorretas[i].setAttribute("required", "");
            }
        }
        const listaInputsInvalidos = formCriacaoPerguntas.querySelectorAll(":invalid");
        const listaInputsValidos = formCriacaoPerguntas.querySelectorAll(":valid");
        criarMensagensInputsInvalidos(listaInputsInvalidos, listaInputsValidos, formCriacaoPerguntas);
        // console.log(listaInputsInvalidos);
        // if (listaInputsInvalidos.length !== 0) {
        //     alert("Preencha os dados corretamente");
        // }
    });

    formCriacaoPerguntas.addEventListener("submit", event => {
        event.preventDefault();
        armazenarInformacoesPerguntas();
        abrirEdicaoNiveis(infoBasicas.qtdNiveis);
    });
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
        elementosURLRespostasIncorretas = pergunta.querySelectorAll(".url-resposta-incorreta");
        for (let i = 0; i < elementosRespostasIncorretas.length; i++) {
            if (elementosRespostasIncorretas[i].value) {
                respostas.push({
                    text: elementosRespostasIncorretas[i].value,
                    image: elementosURLRespostasIncorretas[i].value,
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
    // formCriacaoNiveis = document.querySelector(".criacao-niveis form");
    formCriacaoNiveis.innerHTML = `
        <div class="cria-nivel">
            <div class="topo-form">
                <h2>Nível 1</h2>
                <img src="imagens/Vector.svg" class="escondido" alt="" data-identifier="expand">
            </div>
            <div class="campo-form-nivel" data-identifier="level">
                <input type="text" class="titulo-nivel" name="titulo-nivel" minlength="10" placeholder="Título do nível" required>
                <p class="mensagem-erro escondido"></p>
                <input type="number" class="porcentagem-nivel" name="porcentagem-nivel" min="0" max="100"  placeholder="% de acerto mínima" required>
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-nivel" name="url-nivel" placeholder="URL da imagem do nível" required>
                <p class="mensagem-erro escondido"></p>
                <textarea class="texto-nivel" name="texto-nivel" minlength="30" placeholder="Descrição do nível" required></textarea>
                <p class="mensagem-erro escondido"></p>
            </div>
        </div>`;
    
    for (let i = 1; i < qtdNiveis; i++){
        formCriacaoNiveis.innerHTML += `
        <div class="cria-nivel">
            <div class="topo-form">
                <h2>Nível ${i + 1}</h2>
                <img src="imagens/Vector.svg" class="" alt="" data-identifier="expand">
            </div>
            <div class="campo-form-nivel escondido" data-identifier="level">
                <input type="text" class="titulo-nivel" name="titulo-nivel" minlength="10" placeholder="Título do nível" required>
                <p class="mensagem-erro escondido"></p>
                <input type="number" class="porcentagem-nivel" name="porcentagem-nivel" min="0" max="100" placeholder="% de acerto mínima" required>
                <p class="mensagem-erro escondido"></p>
                <input type="url" class="url-nivel" name="url-nivel" placeholder="URL da imagem do nível" required>
                <p class="mensagem-erro escondido"></p>
                <textarea class="texto-nivel" name="texto-nivel" minlength="30" placeholder="Descrição do nível" required></textarea>
                <p class="mensagem-erro escondido"></p>
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
    eliminarBalaoDialogoErroForms(formCriacaoNiveis);
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
        const listaInputsValidos = formCriacaoNiveis.querySelectorAll(":valid");
        criarMensagensInputsInvalidos(listaInputsInvalidos, listaInputsValidos, formCriacaoNiveis);
        // console.log(list);
        // if (listaInputsInvalidos.length !== 0) {
        //     alert("Preencha os dados corretamente");
        // }
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
    document.querySelector(".criacao-niveis").classList.add("escondido");
    toggleTelaLoading();
    const requisicao = axios.post(ENDERECO_QUIZZES, quizzObjetoCriado);
    
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

    // document.querySelector(".criacao-niveis").classList.add("escondido");

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
            <button class="home-fim" onclick="refreshPage();">Voltar para home</button>
        </div>`;
    telaFimCriacao.classList.remove("escondido");
    toggleTelaLoading();
}

function refreshPage() {
    window.location.reload();
}

function toggleTelaLoading() {
    telaLoading.classList.toggle("escondido");
}

function deletarQuizz(idQuizz) {
    const confirmacao = confirm("Você realmente deseja deletar esse quizz?");

    if (confirmacao){
        document.querySelector("main").add("escondido");
        let promise = axios.delete(`${ENDERECO_QUIZZES}/${idQuizz}`, {
            headers: {
                "Secret-Key": keyQuizz
            }
        });
        promise.then(resposta => {
            window.location.reload();
        });
        promise.catch(error => console.log(error.response.data));
    }
}