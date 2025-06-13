let currentCard = null;
let deck = [];
let step = 0;
let score = 0;
let bet = 1;
let jollyCount = 0;
let correctStreak = 0;
let language = 'it';
let riskMode = 'easy';

const multipliers = [1.2, 1.5, 2, 3, 20, 5, 8, 12, 40, 100];

const translations = {
  it: {
    start: "Inizia",
    cashOut: "Incassa",
    useJolly: "Usa Jolly",
    score: "Punteggio",
    betLabel: "Scegli la puntata:",
    riskLabel: "Modalità rischio:",
    rules: "Regole qui...",
    title: "Carta Passo"
  },
  en: {
    start: "Start",
    cashOut: "Cash Out",
    useJolly: "Use Joker",
    score: "Score",
    betLabel: "Choose your bet:",
    riskLabel: "Risk mode:",
    rules: "Rules here...",
    title: "Step Card"
  }
};

// === Funzioni ===
function updateLanguageTexts() {
  document.getElementById("startBtn").textContent = translations[language].start;
  document.getElementById("cashOutBtn").textContent = translations[language].cashOut;
  document.getElementById("useJollyBtn").textContent = translations[language].useJolly;
  document.getElementById("betLabel").textContent = translations[language].betLabel;
  document.getElementById("riskLabel").textContent = translations[language].riskLabel;
  document.getElementById("rulesText").textContent = translations[language].rules;
  document.getElementById("title").textContent = translations[language].title;
}

function shuffleDeck() {
  deck = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 4; j++) deck.push(i);
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function updateProgressPath() {
  const path = document.getElementById("progressPath");
  path.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const stepWrapper = document.createElement("div");
    stepWrapper.classList.add("progress-step");

    const circle = document.createElement("div");
    circle.classList.add("progress-circle");
    if (i < step) circle.classList.add("active");
    else if (i === step) circle.classList.add("current");
    else circle.classList.add("future");

    const label = document.createElement("div");
    label.className = "multiplier-label";
    label.textContent = `x${multipliers[i]}`;

    stepWrapper.appendChild(circle);
    stepWrapper.appendChild(label);
    path.appendChild(stepWrapper);
  }
}

function updateScorePanel() {
  const panel = document.getElementById("scorePanel");
  panel.textContent = `${translations[language].score}: €${(bet * (multipliers[step - 1] || 1)).toFixed(2)}`;
}

function startGame() {
  bet = parseFloat(document.getElementById("betAmount").value);
  riskMode = document.getElementById("riskLevel").value;
  step = 0;
  score = 0;
  jollyCount = 0;
  correctStreak = 0;
  shuffleDeck();
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("startBtn").disabled = true;
  nextTurn();
}

function nextTurn() {
  if (deck.length === 0 || step >= 10) return;
  currentCard = drawCard();
  document.getElementById("currentCard").src = `cards/${currentCard}.png`;
  document.getElementById("challengeText").textContent = `Carta: ${currentCard}`;
  updateProgressPath();
  updateScorePanel();
}

function handleCorrectAnswer() {
  step++;
  correctStreak++;
  if (correctStreak % 3 === 0) jollyCount++;
  document.getElementById("useJollyBtn").classList.toggle("hidden", jollyCount === 0);
  nextTurn();
}

function handleWrongAnswer() {
  if (jollyCount > 0) {
    jollyCount--;
    document.getElementById("useJollyBtn").classList.toggle("hidden", jollyCount === 0);
    return; // errore annullato dal jolly
  }
  if (riskMode === "easy") step = Math.max(0, step - 2);
  else if (riskMode === "medium") step = 0;
  else step = -1;
  updateProgressPath();
  updateScorePanel();
}

function useJolly() {
  if (jollyCount > 0) {
    jollyCount--;
    document.getElementById("useJollyBtn").classList.toggle("hidden", jollyCount === 0);
    handleCorrectAnswer();
  }
}

function cashOut() {
  alert(`Hai incassato €${(bet * (multipliers[step - 1] || 1)).toFixed(2)}`);
  location.reload();
}

// === Eventi ===
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("useJollyBtn").addEventListener("click", useJolly);
document.getElementById("cashOutBtn").addEventListener("click", cashOut);
document.getElementById("toggle-regolamento").addEventListener("click", () => {
  const popup = document.getElementById("regolamento-popup");
  popup.style.display = popup.style.display === "none" ? "block" : "none";
});
document.getElementById("languageSelect").addEventListener("change", (e) => {
  language = e.target.value;
  updateLanguageTexts();
  updateScorePanel();
  updateProgressPath();
});

// === Init ===
document.addEventListener("DOMContentLoaded", () => {
  updateLanguageTexts();
  updateProgressPath();
});
