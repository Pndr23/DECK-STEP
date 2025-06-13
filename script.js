lconst languageSelect = document.getElementById("languageSelect");
const betSelect = document.getElementById("betAmount");
const riskSelect = document.getElementById("riskLevel");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameArea = document.getElementById("gameArea");
const challengeText = document.getElementById("challengeText");
const choices = document.getElementById("choices");
const currentCard = document.getElementById("currentCard");
const scorePanel = document.getElementById("scorePanel");
const useJollyBtn = document.getElementById("useJollyBtn");
const cashOutBtn = document.getElementById("cashOutBtn");
const progressPath = document.getElementById("progressPath");
const regolamentoPopup = document.getElementById("regolamento-popup");
const toggleRegolamento = document.getElementById("toggle-regolamento");
const rulesText = document.getElementById("rulesText");

const LANG = {
  it: {
    start: "Inizia",
    restart: "Ricomincia",
    betLabel: "Scegli la puntata:",
    riskLabel: "Modalità rischio:",
    useJolly: "Usa Jolly",
    cashOut: "Incassa",
    rules: "Regole del gioco: scegli la sfida giusta per passare la carta. Hai jolly e tappe con moltiplicatori!",
  },
  en: {
    start: "Start",
    restart: "Restart",
    betLabel: "Choose your bet:",
    riskLabel: "Risk mode:",
    useJolly: "Use Joker",
    cashOut: "Cash Out",
    rules: "Game rules: choose the right challenge to pass the card. You have jokers and steps with multipliers!",
  }
};

let currentStep = 0;
let jolly = 1;
let score = 0;
let currentLang = "it";

const multipliers = [1, 2, 3, 5, 8, 12, 20];
const maxSteps = multipliers.length;

function updateLanguage() {
  currentLang = languageSelect.value;
  startBtn.textContent = LANG[currentLang].start;
  restartBtn.textContent = LANG[currentLang].restart;
  document.getElementById("betLabel").textContent = LANG[currentLang].betLabel;
  document.getElementById("riskLabel").textContent = LANG[currentLang].riskLabel;
  useJollyBtn.textContent = LANG[currentLang].useJolly;
  cashOutBtn.textContent = LANG[currentLang].cashOut;
  rulesText.textContent = LANG[currentLang].rules;
}

function drawCard() {
  const number = Math.floor(Math.random() * 13) + 1;
  return number;
}

function startGame() {
  gameArea.classList.remove("hidden");
  startBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
  currentStep = 0;
  score = 0;
  jolly = 1;
  updateScore();
  generateProgress();
  nextRound();
}

function nextRound() {
  if (currentStep >= maxSteps) return;
  const card = drawCard();
  currentCard.src = `cards/${card}.png`;
  challengeText.textContent = currentLang === "it" ? "Sfida: Maggiore o Minore di 7?" : "Challenge: Higher or Lower than 7?";

  choices.innerHTML = "";
  ["minore", "maggiore"].forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = currentLang === "it" ? opt : opt === "minore" ? "Lower" : "Higher";
    btn.onclick = () => checkAnswer(opt, card);
    choices.appendChild(btn);
  });
}

function checkAnswer(answer, card) {
  const correct = (answer === "minore" && card < 7) || (answer === "maggiore" && card > 7);
  if (correct) {
    score += multipliers[currentStep] * parseFloat(betSelect.value);
    currentStep++;
    updateScore();
    updateProgress();
    nextRound();
  } else if (jolly > 0) {
    useJollyBtn.classList.remove("hidden");
    useJollyBtn.onclick = () => {
      jolly--;
      useJollyBtn.classList.add("hidden");
      currentStep++;
      updateScore();
      updateProgress();
      nextRound();
    };
  } else {
    alert("Game Over!");
    gameArea.classList.add("hidden");
    startBtn.classList.remove("hidden");
  }
}

function updateScore() {
  scorePanel.textContent = `Punteggio: €${score.toFixed(2)} | Jolly: ${jolly}`;
}

function generateProgress() {
  progressPath.innerHTML = "";
  for (let i = 0; i < multipliers.length; i++) {
    const step = document.createElement("div");
    step.classList.add("progress-step");

    const circle = document.createElement("div");
    circle.classList.add("progress-circle");
    if (i === currentStep) circle.classList.add("current");
    else if (i < currentStep) circle.classList.add("active");
    else circle.classList.add("future");

    const label = document.createElement("div");
    label.classList.add("multiplier-label");
    label.textContent = `x${multipliers[i]}`;

    step.appendChild(circle);
    step.appendChild(label);
    progressPath.appendChild(step);
  }
}

function updateProgress() {
  generateProgress();
}

languageSelect.addEventListener("change", updateLanguage);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
toggleRegolamento.addEventListener("click", () => {
  regolamentoPopup.style.display = regolamentoPopup.style.display === "none" ? "block" : "none";
});

updateLanguage();


