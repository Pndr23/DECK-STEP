
let currentLanguage = "it";
const translations = {
  it: {
    "title": "Carta Passo",
    "language-label": "Lingua:",
    "difficulty-label": "Difficoltà:",
    "easy": "Facile",
    "medium": "Media",
    "hard": "Difficile",
    "bet-label": "Puntata:",
    "rules-title": "Regolamento",
    "rules-text": "Scegli la tua difficoltà e la puntata. Indovina correttamente le carte per avanzare nelle tappe e vincere!",
    "start-button": "Inizia",
    "win-message": "Hai vinto!",
    "lose-message": "Hai perso!",
    "joker-used": "Hai usato un Jolly!",
    "error-message": "Risposta sbagliata!",
    "next-step": "Prossima tappa",
    "restart": "Ricomincia"
  },
  en: {
    "title": "Card Step",
    "language-label": "Language:",
    "difficulty-label": "Difficulty:",
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard",
    "bet-label": "Bet:",
    "rules-title": "Rules",
    "rules-text": "Choose your difficulty and bet. Guess the cards correctly to advance through the stages and win!",
    "start-button": "Start",
    "win-message": "You won!",
    "lose-message": "You lost!",
    "joker-used": "You used a Joker!",
    "error-message": "Wrong answer!",
    "next-step": "Next step",
    "restart": "Restart"
  }
};

function changeLanguage() {
  currentLanguage = document.getElementById("language").value;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLanguage][key]) {
      el.innerText = translations[currentLanguage][key];
    }
  });
}

function t(key) {
  return translations[currentLanguage][key] || key;
}


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
      challengeText.textContent = t("lose-message");
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



// Testi tradotti per messaggi dinamici
const dynamicTexts = {
  it: {
    "win-message": t("win-message"),
    "lose-message": t("lose-message"),
    "joker-used": t("joker-used"),
    "error-message": t("error-message"),
    "next-step": t("next-step"),
    "restart": t("restart")
  },
  en: {
    "win-message": "You won!",
    "lose-message": "You lost!",
    "joker-used": "You used a Joker!",
    "error-message": "Wrong answer!",
    "next-step": "Next stage",
    "restart": "Restart"
  }
};

// Funzione per ottenere testo dinamico tradotto
function t(key) {
  const lang = document.getElementById("language").value;
  return dynamicTexts[lang][key] || key;
}

// Esempio di uso nei messaggi dinamici:
// alert(t("win-message")); oppure document.getElementById("result").innerText = t("lose-message");
