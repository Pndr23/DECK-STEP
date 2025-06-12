let tappe = 0;

const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const correctCountSpan = document.getElementById("correctCount");
const errorCountSpan = document.getElementById("errorCount");
const jollyCountSpan = document.getElementById("jollyCount");
const restartBtn = document.getElementById("restartBtn");
const rulesToggle = document.getElementById("rulesToggle");
const rulesPanel = document.getElementById("rulesPanel");

let currentCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;

rulesToggle.addEventListener("click", () => {
  rulesPanel.classList.toggle("hidden");
});

startBtn.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  correctCount = 0;
  errorCount = 0;
  jollyCount = 0;
  updateScore();
  startGame();
});

restartBtn.addEventListener("click", () => {
  gameSetup.classList.remove("hidden");
  gameArea.classList.add("hidden");
});

function updateScore() {
  document.getElementById("scoreValue").innerText = score;
  correctCountSpan.textContent = correctCount;
  errorCountSpan.textContent = errorCount;
  jollyCountSpan.textContent = jollyCount;
}

function startGame() {
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}

function drawCard() {
  return Math.floor(Math.random() * 13) + 1;
}

function displayCard(cardNumber) {
  currentCardImg.src = `cards/card_${cardNumber}.png`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const selected = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = `Sfida: ${selected}`;
  challengeButtons.innerHTML = "";

  if (selected === "Maggiore o Minore") {
    addButton("Maggiore", guess => guess > currentCard);
    addButton("Minore", guess => guess < currentCard);
  } else if (selected === "Pari o Dispari") {
    addButton("Pari", () => currentCard % 2 === 0);
    addButton("Dispari", () => currentCard % 2 !== 0);
  } else if (selected === "Dentro o Fuori") {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addButton("Dentro", () => currentCard >= a && currentCard <= b);
    addButton("Fuori", () => currentCard < a || currentCard > b);
  } else if (selected === "Numero Esatto") {
    for (let i = 1; i <= 13; i++) {
      addButton(i, () => i == currentCard);
    }
  }
}

function addButton(text, checkFn) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    if (checkFn(Number(text))) {
      correctCount++;
      if (correctCount % 3 === 0) jollyCount++;
    } else {
      if (jollyCount > 0) {
        jollyCount--;
      } else {
        errorCount++;
      }
    }
    updateScore();
    if (errorCount >= 3) {
      challengeText.textContent = "Hai perso!";
      challengeButtons.innerHTML = "";
      restartBtn.classList.remove("hidden");
    } else {
      startGame();
    }
  };
  challengeButtons.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", () => {
  if (navigator.language.startsWith("en")) {
    document.querySelector("html").lang = "en";
    document.querySelector("h1").textContent = "Card Step";
    document.getElementById("startBtn").textContent = "🎮 Start";
    document.getElementById("restartBtn").textContent = "🔁 Restart";
    document.getElementById("rulesToggle").textContent = "📜 Rules";
    document.getElementById("rulesPanel").innerHTML = "<p>Guess correctly to advance. After 3 right answers, you get a Jolly!</p><ul><li>Higher/Lower</li><li>Even/Odd</li><li>Inside/Outside</li><li>Exact number</li></ul>";
    document.getElementById("currentCardLabel").textContent = "Current card:";
  }
});
