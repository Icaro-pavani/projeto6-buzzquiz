const criarQuizzButton = document.querySelector(".criar-quiz button");
const formInicioCriacaoQuizz = document.querySelector(".inicio-criacao form");
const prosseguirParaPerguntasButton = document.querySelector(".prosseguir-perguntas");

let infoBasicas = {};

const iniciarCriarQuizz = event => {
    document.querySelector("main").classList.add("escondido");
    document.querySelector(".inicio-criacao").classList.remove("escondido");
}

criarQuizzButton.addEventListener("click", iniciarCriarQuizz);

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
})

prosseguirParaPerguntasButton.addEventListener("click", () => {
    const listaInputsInvalidos = formInicioCriacaoQuizz.querySelectorAll(":invalid");
    // console.log(list);
    if (listaInputsInvalidos.length !== 0) {
        alert("Preencha os dados corretamente");
    }
})

function invalidMsg(element) {
    element.setCustomValidity('');
}

function abrirEdicaoPerguntas(qtdPerguntas) {
    const formCriacaoPerguntas = document.querySelector(".criacao-perguntas form");
    formCriacaoPerguntas.innerHTML = `
        <div class="cria-pergunta">
            <div class="topo-form">
                <h2>Pergunta 1</h2>
                <img src="imagens/Vector.svg" class="escondido" alt="">
            </div>
            <div class="campo-form-pergunta">
                <div class="definicao-pergunta">
                    <input type="text" class="texto-pergunta" name="texto-pergunta" minlength="20" placeholder="Texto da pergunta" required>
                    <input type="text" class="cor-fundo" name="cor-fundo" placeholder="Cor de fundo da pergunta" required>
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
                        <input type="text" class="cor-fundo" name="cor-fundo" placeholder="Cor de fundo da pergunta" required>
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
}
