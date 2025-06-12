
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const resultMessage = document.getElementById("resultMessage");
const stepCount = document.getElementById("stepCount");

let deck = [];
let currentCard = null;
let step = 1;
let riskMode = "easy";

startBtn.addEventListener("click", () => {
  const bet = document.getElementById("bet").value;
  riskMode = document.getElementById("risk").value;
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");

  initializeDeck();
  drawNewCard();
});

function initializeDeck() {
  deck = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 4; j++) {
      deck.push(i);
    }
  }
  shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawNewCard() {
  if (deck.length === 0) {
    alert("Mazzo esaurito!");
    return;
  }
  currentCard = deck.pop();
  displayCard(currentCard);
  generateChallenge();
  stepCount.textContent = "Tappa: " + step;
  resultMessage.textContent = "";
}

function displayCard(cardNumber) {
  currentCardImg.src = `cards/card_${cardNumber}.png`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const randomIndex = Math.floor(Math.random() * challenges.length);
  const selectedChallenge = challenges[randomIndex];

  challengeText.textContent = `Sfida: ${selectedChallenge}`;
  challengeButtons.innerHTML = "";

  if (selectedChallenge === "Maggiore o Minore") {
    addChallengeButton("Maggiore", (next) => next > currentCard);
    addChallengeButton("Minore", (next) => next < currentCard);
  } else if (selectedChallenge === "Pari o Dispari") {
    addChallengeButton("Pari", (next) => next % 2 === 0);
    addChallengeButton("Dispari", (next) => next % 2 !== 0);
  } else if (selectedChallenge === "Dentro o Fuori") {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addChallengeButton("Dentro", (next) => next >= a && next <= b);
    addChallengeButton("Fuori", (next) => next < a || next > b);
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 10; i++) {
      addChallengeButton(i.toString(), (next) => next === i);
    }
  }
}

function addChallengeButton(label, isCorrectFunc) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = () => {
    const nextCard = deck.pop();
    const correct = isCorrectFunc(nextCard);
    displayCard(nextCard);

    if (correct) {
      resultMessage.textContent = "Hai indovinato!";
      step++;
    } else {
      resultMessage.textContent = "Errore!";
      if (riskMode === "easy") step = Math.max(1, step - 2);
      else if (riskMode === "medium") step = 1;
      else if (riskMode === "hard") {
        alert("Hai perso tutto!");
        location.reload();
        return;
      }
    }
    setTimeout(drawNewCard, 1500);
  };
  challengeButtons.appendChild(btn);
}
