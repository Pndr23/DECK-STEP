let tappe = 0;

const startButton = document.getElementById("startButton");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const correctCountSpan = document.getElementById("correctCount");
const errorCountSpan = document.getElementById("errorCount");
const jollyCountSpan = document.getElementById("jollyCount");
const restartBtn = document.getElementById("restartBtn");
const rulesToggle = document.getElementById("rulesLabel");
const rulesPanel = document.getElementById("rulesPanel");

let currentCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;

rulesToggle.addEventListener("click", () => {
  rulesPanel.classList.toggle("hidden");
});

startButton.addEventListener("click", () => {
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
  document.getElementById("scoreValue").innerText = correctCount;
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
    document.getElementById("startButton").textContent = "🎮 Start";
    document.getElementById("restartBtn").textContent = "🔁 Restart";
    document.getElementById("rulesLabel").textContent = "📜 Rules";
    document.getElementById("rulesPanel").innerHTML =  `<p>Welcome to <strong>Card Step</strong>! Your goal is to complete a series of random challenges by correctly guessing the result of the next card.</p>
  <ul>
    <li>You can choose the <strong>starting bet</strong> between €0.10, €0.20, €0.50, €1, €2 and €5.</li>
    <li>You can also select the <strong>difficulty</strong>: Easy, Medium or Hard (more challenges, fewer jokers).</li>
    <li>Each turn a card is drawn and you're given a challenge (e.g. higher/lower, even/odd, etc.).</li>
    <li>Each correct answer lets you advance to the next <strong>stage</strong>.</li>
    <li>After 3 correct answers in a row, you receive a <strong>joker</strong> that can be used to skip or cancel an error.</li>
    <li>3 mistakes end the game. You can restart with the 🔁 button.</li>
    <li>The game is automatically translated to Italian or English based on your browser language.</li>
      </ul>`;
    document.getElementById("currentCardLabel").textContent = "Current card:";
  }
});
