const state = {
    scores: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    actions: {
        next: document.getElementById('next-duel')
    },
    audios: {
        win: new Audio('src/assets/audios/win.wav'),
        lose: new Audio('src/assets/audios/lose.wav')
    }
    
}
const playerSides = {
    player1: 'player-cards',
    player1Box: document.getElementById('player-cards'),
    computer: 'computer-cards',
    computerBox: document.getElementById('computer-cards')
}
const pathImage = 'src/assets/icons/'
const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: pathImage + 'dragon.png',
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: pathImage + 'magician.png',
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: pathImage + 'exodia.png',
        winOf: [0],
        loseOf: [1]
    }
];
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100');
    cardImage.setAttribute('src', pathImage + 'card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');
    if(fieldSide === playerSides.player1) {
        cardImage.onmouseover = function() {
            drawSelectCard(idCard);
        }
        cardImage.onclick = function() {
            setCardsField(idCard);
        }
    }
    return cardImage;
}
async function setCardsField(id) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.player.src = cardData[id].img;
    state.fieldCards.computer.style.display = 'block';
    state.fieldCards.computer.src = cardData[computerCardId].img;
    let duelResults = await checkDuelResults(id, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}
async function drawButton(text) {
    state.actions.next.textContent = text;
    state.actions.next.style.display = 'block';
}
async function updateScore() {
    state.scores.scoreBox.textContent = `Win: ${state.scores.playerScore} | Lose: ${state.scores.computerScore}`;
}
async function checkDuelResults(...cardIds) {
    let duelResults = 'Draw';
    let playerCard = cardData[cardIds[0]];
    if(playerCard.winOf.includes(cardIds[1])) {
        duelResults = 'win';
        state.scores.playerScore++;
    }
    if(playerCard.loseOf.includes(cardIds[1])) {
        duelResults = 'lose';
        state.scores.computerScore++;
    }
    playAudio(duelResults);
    return duelResults;
}
async function removeAllCardsImages() {
    while(playerSides.player1Box.firstChild) {
        playerSides.player1Box.firstChild.remove();
    }
    while(playerSides.computerBox.firstChild) {
        playerSides.computerBox.firstChild.remove();
    }
}
async function drawSelectCard(i) {
    state.cardSprites.avatar.src = cardData[i].img;
    state.cardSprites.name.textContent = cardData[i].name;
    state.cardSprites.type.textContent = 'Attribute: ' + cardData[i].type;
}
async function drawCards(cardNumbers, ...fieldSides) {
    for(let fieldSide of fieldSides) {
        for(let i = 0; i < cardNumbers; i++) {
            const randomIdCard = await getRandomCardId();
            const cardImage = await createCardImage(randomIdCard, fieldSide);
            document.getElementById(fieldSide).appendChild(cardImage);
        }
    }
}
async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.cardSprites.name.textContent = '';
    state.cardSprites.type.textContent = '';
    state.actions.next.style.display = 'none';
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    init();
}
async function playAudio(status) {
    try {
        state.audios[status].currentTime = 0;
        await state.audios[status].play();
    } catch {

    }
}
function init() {
    drawCards(5, playerSides.player1, playerSides.computer);
    document.getElementById('bgm').play();
}
init();