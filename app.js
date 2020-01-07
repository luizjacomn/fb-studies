/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];

/**
 * Botão para cria um card no card-contaier
 */
function criarCard() {
    var card = {
        nome: NOMES[Math.floor(Math.random() * (NOMES.length - 1))],
        idade: Math.floor(Math.random() * 22 + 18),
        curtidas: 0
    };
    /**
     * .collection: Referenciar uma coleção
     * .doc('documento'): Referenciar um documento
     * .set({dados}): Insere o objeto passado por parâmetro na referência
     */
    // firebase.firestore().collection('cards').doc('1').set(card).then(() => {
    //     console.log('dados salvos');
    //     adicionaCardATela(card, 1);
    // });

    /**
     * add({dados}): Adiciona os dados dentro de um UID gerado automaticamente
     */
    firebase.firestore().collection('cards').add(card).then(() => {
        console.log('dados salvos');
    });
};

/**
 * Limpar todos os cards
 */
function limpar() {
    firebase.firestore().collection('cards').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            this.deletar(doc.id);
        });
    });
    var child = CARD_CONTAINER.lastElementChild;
    while (child) {
        CARD_CONTAINER.removeChild(child);
        child = CARD_CONTAINER.lastElementChild;
    }
}

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    var card = document.getElementById(id);
    firebase.firestore().collection('cards').doc(id).delete().then(() => {
        card.parentElement.removeChild(card);
    });
};

/**
 * Incrementa o numero de curtidas
 * @param {String} id Id do card
 */
function curtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName('count-number')[0];
    var button = card.getElementsByClassName('btn-danger')[0];
    var countNumber = +count.innerText;
    countNumber++;

    firebase.firestore().collection('cards').doc(id).update({
        curtidas: countNumber
    }).then(() => {
        count.innerText = countNumber;
        if (countNumber == 0) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    });
};

/**
 * Decrementa o numero de curtidas
 * @param {String} id Id do card
 */
function descurtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName('count-number')[0];
    var button = card.getElementsByClassName('btn-danger')[0];
    var countNumber = +count.innerText;
    if (countNumber > 0) {
        countNumber--;
        firebase.firestore().collection('cards').doc(id).update({
            curtidas: countNumber
        }).then(() => {
            count.innerText = countNumber;
            if (countNumber == 0) {
                button.classList.add('disabled');
            } else {
                button.classList.remove('disabled');//TODO 11
            }
        });
    }
};

/**
 * Espera o evento de que a DOM está pronta para executar algo
 */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * get(): Busca os documentos apenas no carregamento
     */
    // firebase.firestore().collection('cards').get().then((snapshot) => {
    //     snapshot.docs.forEach(doc => {
    //         adicionaCardATela(doc.data(), doc.id);
    //     });
    // });

    /**
     * onSnapshot(): responde apenas às mudanças dos documentos afetados
     */
    firebase.firestore().collection('cards').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            switch (change.type) {
                case 'added':
                    adicionaCardATela(change.doc.data(), change.doc.id);
                    break;
                case 'modified':
                    console.log('modified');
                    break;
                case 'removed':
                    console.log('removed');
                    break;
            }
        });
    });
});

/**
 * Adiciona card na tela
 * @param {Object} informacao Objeto contendo dados do card
 * @param {String} id UID do objeto inserido/consultado
 */
function adicionaCardATela(informacao, id) {
    /**
     * HEADER DO CARD
     */
    let header = document.createElement("h2");
    header.innerText = informacao.nome;
    header.classList.add('card-title');
    // ===================================

    /**
     * CONTENT DO CARD
     */
    let content = document.createElement("p");
    content.classList.add('card-text');
    content.innerText = informacao.idade + ' anos.';
    // ===================================

    /**
     * BOTÕES DO CARD
     */
    let inner = document.createElement("div");
    inner.classList.add('row')
    // Botão adicionar
    let button_add = document.createElement("button");
    button_add.classList.add('btn', 'btn-success', 'btn-link', 'col-2');
    button_add.setAttribute('onclick', "curtir('" + id + "')");
    button_add.innerText = '+';
    inner.appendChild(button_add);

    // Contador de curtidas
    let counter = document.createElement("span");
    counter.innerHTML = informacao.curtidas;
    counter.classList.add('col-3', 'text-center', 'count-number');
    inner.appendChild(counter);

    // Botão de subtrair
    let button_sub = document.createElement("button");
    button_sub.classList.add('btn', 'btn-danger', 'btn-link', 'col-2');
    button_sub.setAttribute('onclick', "descurtir('" + id + "')");
    button_sub.innerText = '-';
    inner.appendChild(button_sub);
    // ===================================

    // Espaço
    let spacer = document.createElement("div");
    spacer.classList.add('col-1');
    inner.appendChild(spacer);

    // Botão de excluir
    let button_del = document.createElement("button");
    button_del.classList.add('btn', 'btn-danger', 'col-3');
    button_del.setAttribute('onclick', "deletar('" + id + "')");
    button_del.innerText = 'x';
    inner.appendChild(button_del);
    // ===================================

    /**
     * CARD
     */
    let card = document.createElement("div");
    card.classList.add('card');
    card.id = id;
    let card_body = document.createElement("div");
    card_body.classList.add('card-body');
    card.style.marginBottom = '10px';
    // ===================================

    // popula card
    card_body.appendChild(header);
    card_body.appendChild(content);
    card_body.appendChild(inner);
    card.appendChild(card_body);

    // insere no container
    CARD_CONTAINER.appendChild(card);
}