
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const languageSelect = document.getElementById("language");

let currentCard = null;
let language = "it";

const translations = {
  it: {
    title: "Carta Passo",
    rulesTitle: "Regole del Gioco",
    rulesText: "Benvenuto in Carta Passo! Il tuo obiettivo è superare 10 tappe indovinando le caratteristiche della prossima carta. Dopo ogni sfida puoi ritirarti o continuare. Se sbagli, subisci la penalità in base alla modalità scelta.",
    betLabel: "Puntata:",
    riskLabel: "Modalità rischio:",
    currentCardLabel: "Carta attuale:",
    challengePrefix: "Sfida: ",
    startBtn: "Inizia la partita"
  },
  en: {
    title: "Card Pass",
    rulesTitle: "Game Rules",
    rulesText: "Welcome to Card Pass! Your goal is to complete 10 stages by guessing features of the next card. After each challenge you can withdraw or continue. If you fail, the penalty depends on the chosen mode.",
    betLabel: "Bet:",
    riskLabel: "Risk mode:",
    currentCardLabel: "Current card:",
    challengePrefix: "Challenge: ",
    startBtn: "Start Game"
  }
};

function applyTranslations(lang) {
  const t = translations[lang];
  document.getElementById("title").textContent = t.title;
  document.getElementById("rulesTitle").textContent = t.rulesTitle;
  document.getElementById("rulesText").textContent = t.rulesText;
  document.getElementById("betLabel").textContent = t.betLabel;
  document.getElementById("riskLabel").textContent = t.riskLabel;
  document.getElementById("currentCardLabel").textContent = t.currentCardLabel;
  document.getElementById("challengeText").textContent = t.challengePrefix;
  document.getElementById("startBtn").textContent = t.startBtn;
}

languageSelect.addEventListener("change", (e) => {
  language = e.target.value;
  applyTranslations(language);
});

// Rileva la lingua del browser e imposta quella iniziale
const browserLang = navigator.language.slice(0, 2);
if (translations[browserLang]) {
  language = browserLang;
  languageSelect.value = browserLang;
  applyTranslations(language);
}

startBtn.addEventListener("click", () => {
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
  return Math.floor(Math.random() * 13) + 1;
}

function displayCard(cardNumber) {
  const fileName = `card_${cardNumber}.png`;
  currentCardImg.src = `cards/${fileName}`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = translations[language].challengePrefix + selectedChallenge;
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
    addButton("Dentro");
    addButton("Fuori");
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 13; i++) {
      addButton(i.toString());
    }
  }
}

function addButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => alert(`Hai scelto: ${text}`);
  challengeButtons.appendChild(btn);
}
