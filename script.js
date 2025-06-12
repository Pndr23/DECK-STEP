
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const gameSummary = document.getElementById("gameSummary");
const summaryScore = document.getElementById("summaryScore");
const summaryStats = document.getElementById("summaryStats");
const restartBtn = document.getElementById("restartBtn");

let currentCard = null;
let score = 0;
let correctStreak = 0;
let jollyAvailable = false;
let usedJolly = false;

let roundsPlayed = 0;
let roundsWon = 0;
let errors = 0;

startBtn.addEventListener("click", () => {
  const bet = document.getElementById("bet").value;
  const risk = document.getElementById("risk").value;

  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");

  startGame();
});

function startGame() {
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function displayCard(cardNumber) {
  const fileName = cardNumber < 10 ? `card_${cardNumber}.PNG` : `card_10.PNG`;
  currentCardImg.src = `cards/${fileName}`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const randomIndex = Math.floor(Math.random() * challenges.length);
  const selectedChallenge = challenges[randomIndex];

  challengeText.textContent = `Sfida: ${selectedChallenge}`;
  challengeButtons.innerHTML = "";

  if (selectedChallenge === "Maggiore o Minore") {
    addButton("Maggiore");
    addButton("Minore");
  } else if (selectedChallenge === "Pari o Dispari") {
    addButton("Pari");
    addButton("Dispari");
  } else if (selectedChallenge === "Dentro o Fuori") {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    challengeButtons.dataset.rangeA = a;
    challengeButtons.dataset.rangeB = b;
    addButton("Dentro");
    addButton("Fuori");
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString());
    }
  }
}

function addButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    roundsPlayed++;
    if (Math.random() > 0.3) { // simulazione successo
      roundsWon++;
      score += 10;
    } else {
      errors++;
    }
    showSummary();
  };
  challengeButtons.appendChild(btn);
}

function showSummary() {
  gameArea.classList.add("hidden");
  gameSummary.classList.remove("hidden");

  summaryScore.textContent = `Punteggio totale: ${score}`;
  summaryStats.textContent = `Sfide giocate: ${roundsPlayed} | Vinte: ${roundsWon} | Errori: ${errors}`;
}

restartBtn.addEventListener("click", () => {
  score = 0;
  correctStreak = 0;
  jollyAvailable = false;
  usedJolly = false;
  roundsPlayed = 0;
  roundsWon = 0;
  errors = 0;

  gameSummary.classList.add("hidden");
  gameSetup.classList.remove("hidden");
});
