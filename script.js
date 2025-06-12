let currentCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;
let tappa = 0;
let consecutiveCorrect = 0;

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
const scoreValue = document.getElementById("scoreValue");
const progressCounter = document.getElementById("progressCounter");
const progressPath = document.getElementById("progressPath");
const useJollyBtn = document.getElementById("useJollyBtn");

rulesToggle.addEventListener("click", () => {
  rulesPanel.classList.toggle("hidden");
});

startButton.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  resetGame();
  startGame();
});

restartBtn.addEventListener("click", () => {
  gameSetup.classList.remove("hidden");
  gameArea.classList.add("hidden");
});

useJollyBtn.addEventListener("click", () => {
  if (jollyCount > 0 && errorCount > 0) {
    jollyCount--;
    errorCount--;
    updateScore();
  }
});

function resetGame() {
  correctCount = 0;
  errorCount = 0;
  jollyCount = 0;
  tappa = 0;
  consecutiveCorrect = 0;
  updateScore();
  updateProgressPath();
}

function updateScore() {
  correctCountSpan.textContent = correctCount;
  errorCountSpan.textContent = errorCount;
  jollyCountSpan.textContent = jollyCount;
  scoreValue.textContent = correctCount;
  progressCounter.textContent = `Tappa: ${tappa}`;
  useJollyBtn.classList.toggle("hidden", jollyCount === 0);
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
    const correct = checkFn(Number(text));
    if (correct) {
      correctCount++;
      tappa++;
      consecutiveCorrect++;
      if (consecutiveCorrect === 3) {
        jollyCount++;
        consecutiveCorrect = 0;
      }
    } else {
      if (jollyCount > 0) {
        jollyCount--;
      } else {
        errorCount++;
        consecutiveCorrect = 0;
      }
    }

    updateScore();
    updateProgressPath();

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

function updateProgressPath() {
  progressPath.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const step = document.createElement("div");
    step.classList.add("progress-step");
    if (i < tappa) step.classList.add("active");
    if (i === tappa) step.classList.add("current");
    progressPath.appendChild(step);
  }
}
