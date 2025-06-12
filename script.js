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



const translations = {
  it: {
    rules: "Regole del gioco",
    start: "Inizia",
    restart: "Ricomincia",
    betPrompt: "Fai la tua puntata",
  },
  en: {
    rules: "Game Rules",
    start: "Start",
    restart: "Restart",
    betPrompt: "Place your bet",
  }
};

function setLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };
  setText("rules-title", t.rules);
  setText("start-button", t.start);
  setText("restart-button", t.restart);
  setText("bet-label", t.betPrompt);
}



const translations = {
  it: {
    gameTitle: "Carta Passo",
    rulesToggle: "📜 Regole",
    rulesSummary: "📖 Regole del gioco",
    rulesIntro: "Benvenuto in Carta Passo! Il tuo obiettivo è superare una serie di sfide casuali indovinando correttamente il risultato della carta successiva.",
    rule1: "Puoi scegliere la puntata iniziale tra €0.10, €0.20, €0.50, €1, €2 e €5.",
    rule2: "Puoi anche scegliere la difficoltà: Easy, Medium o Hard (più sfide, meno jolly).",
    rule3: "Ogni turno una carta viene pescata e ti viene proposta una sfida (es. maggiore/minore, pari/dispari, ecc.).",
    rule4: "Ogni risposta corretta ti fa avanzare di una tappa.",
    rule5: "Dopo 3 risposte corrette consecutive, ricevi un jolly che può essere usato per saltare o annullare un errore.",
    rule6: "3 errori terminano la partita. Puoi ricominciare con il pulsante 🔁.",
    rule7: "Il gioco è tradotto automaticamente in italiano o inglese secondo la lingua del browser.",
  },
  en: {
    gameTitle: "Card Pass",
    rulesToggle: "📜 Rules",
    rulesSummary: "📖 Game Rules",
    rulesIntro: "Welcome to Card Pass! Your goal is to overcome a series of random challenges by correctly guessing the result of the next card.",
    rule1: "You can choose the starting bet among €0.10, €0.20, €0.50, €1, €2 and €5.",
    rule2: "You can also choose the difficulty: Easy, Medium or Hard (more challenges, fewer jokers).",
    rule3: "Each turn a card is drawn and a challenge is presented (e.g. higher/lower, even/odd, etc.).",
    rule4: "Each correct answer moves you one step forward.",
    rule5: "After 3 consecutive correct answers, you get a joker that can be used to skip or cancel a mistake.",
    rule6: "3 mistakes end the game. You can restart with the 🔁 button.",
    rule7: "The game is automatically translated into Italian or English based on your browser's language.",
  }
};

function setLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };
  setText("game-title", t.gameTitle);
  setText("rules-toggle", t.rulesToggle);
  setText("rules-summary", t.rulesSummary);
  setText("rules-intro", t.rulesIntro);
  setText("rule-1", t.rule1);
  setText("rule-2", t.rule2);
  setText("rule-3", t.rule3);
  setText("rule-4", t.rule4);
  setText("rule-5", t.rule5);
  setText("rule-6", t.rule6);
  setText("rule-7", t.rule7);
}

window.addEventListener("load", () => {
  const defaultLang = navigator.language.startsWith("en") ? "en" : "it";
  document.getElementById("lang").value = defaultLang;
  setLanguage(defaultLang);
});
