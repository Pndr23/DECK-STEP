let tappe = 0;
let currentCard = null;
let nextCard = null;    // nuova variabile per la carta da indovinare
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;
let usedJolly = false;
let currentLanguage = "it";

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
const progressCounter = document.getElementById("progressCounter");
const progressPath = document.getElementById("progressPath");
const useJollyBtn = document.getElementById("useJollyBtn");
const languageSelect = document.getElementById("languageSelect");

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
    updateJollyButton();
  }
});

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  updateLanguage();
});

function resetGame() {
  correctCount = 0;
  errorCount = 0;
  jollyCount = 0;
  tappe = 0;
  usedJolly = false;
  updateScore();
  updateProgress();
  updateJollyButton();
}

function updateScore() {
  document.getElementById("scoreValue").innerText = correctCount;
  correctCountSpan.textContent = correctCount;
  errorCountSpan.textContent = errorCount;
  jollyCountSpan.textContent = jollyCount;
}

function updateJollyButton() {
  useJollyBtn.classList.toggle("hidden", jollyCount === 0 || errorCount === 0);
}

function startGame() {
  currentCard = drawCard();
  nextCard = drawCard();
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
  const challenges = [
    { it: "Maggiore o Minore", en: "Higher or Lower" },
    { it: "Pari o Dispari", en: "Even or Odd" },
    { it: "Dentro o Fuori", en: "In or Out" },
    { it: "Numero Esatto", en: "Exact Number" }
  ];
  const selected = challenges[Math.floor(Math.random() * challenges.length)];
  const label = selected[currentLanguage];

  challengeText.textContent = `${translate("challenge")}: ${label}`;
  challengeButtons.innerHTML = "";

  if (label === translate("higher") + " o " + translate("lower")) {
    addButton(translate("higher"), guess => guess > currentCard);
    addButton(translate("lower"), guess => guess < currentCard);
  } else if (label === translate("even") + " o " + translate("odd")) {
    addButton(translate("even"), () => nextCard % 2 === 0);
    addButton(translate("odd"), () => nextCard % 2 !== 0);
  } else if (label === translate("in") + " o " + translate("out")) {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addButton(translate("in"), () => nextCard >= a && nextCard <= b);
    addButton(translate("out"), () => nextCard < a || nextCard > b);
  } else { // Numero Esatto
    for (let i = 1; i <= 13; i++) {
      addButton(i, () => i == nextCard);
    }
  }
}

function addButton(text, checkFn) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    if (checkFn(Number(text))) {
      correctCount++;
      tappe++;
      if (correctCount % 3 === 0) jollyCount++;
    } else {
      if (jollyCount > 0 && errorCount < 3) {
        jollyCount--;
      } else {
        errorCount++;
      }
    }
    updateScore();
    updateProgress();
    updateJollyButton();

    if (errorCount >= 3) {
      challengeText.textContent = translate("lost");
      challengeButtons.innerHTML = "";
      restartBtn.classList.remove("hidden");
    } else {
      currentCard = nextCard;    // aggiorna la carta attuale a quella appena indovinata
      nextCard = drawCard();     // pesca la nuova carta da indovinare
      displayCard(currentCard);
      generateChallenge();
    }
  };
  challengeButtons.appendChild(btn);
}

function updateProgress() {
  progressCounter.textContent = `${translate("stage")}: ${tappe}`;
  progressPath.innerHTML = "";

  const multipliers = [1.2, 1.5, 2, 3, 20, 5, 8, 12, 40, 100];

  for (let i = 0; i < 10; i++) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";

    const step = document.createElement("div");
    step.classList.add("progress-step");

    if (i < tappe) {
      step.classList.add("active");
    } else if (i === tappe) {
      step.classList.add("current");
    } else {
      step.classList.add("future");
    }

    const label = document.createElement("div");
    label.classList.add("multiplier-label");
    label.textContent = "x" + multipliers[i].toFixed(2);

    wrapper.appendChild(step);
    wrapper.appendChild(label);
    progressPath.appendChild(wrapper);
  }
}

function updateLanguage() {
  document.querySelector("html").lang = currentLanguage;
  document.getElementById("gameTitle").textContent = translate("title");
  document.getElementById("startButton").textContent = translate("start");
  document.getElementById("restartBtn").textContent = translate("restart");
  document.getElementById("rulesLabel").textContent = translate("rules");
  document.getElementById("currentCardLabel").textContent = translate("currentCard");
  document.getElementById("betLabel").textContent = translate("bet");
  document.getElementById("riskLabel").textContent = translate("risk");
  document.getElementById("pointsLabel").textContent = translate("points");
  document.getElementById("correctLabel").textContent = "✅ " + translate("correct");
  document.getElementById("errorLabel").textContent = "❌ " + translate("error");
  document.getElementById("jollyLabel").textContent = "🃏 " + translate("jolly");
  useJollyBtn.textContent = "🃏 " + translate("useJolly");
  updateProgress();
  rulesPanel.innerHTML = translate("rulesText");
}

function translate(key) {
  const t = {
    it: {
      title: "Carta Passo",
      start: "🎮 Inizia la partita",
      restart: "🔁 Ricomincia",
      rules: "📜 Regole",
      currentCard: "Carta attuale:",
      challenge: "Sfida",
      higher: "Maggiore",
      lower: "Minore",
      even: "Pari",
      odd: "Dispari",
      in: "Dentro",
      out: "Fuori",
      correct: "Corrette",
      error: "Errori",
      jolly: "Jolly",
      useJolly: "Usa Jolly",
      stage: "Tappa",
      points: "Punti:",
      bet: "Puntata:",
      risk: "Modalità rischio:",
      lost: "Hai perso!",
      rulesText: `<p>Benvenuto in <strong>Carta Passo</strong>! Il tuo obiettivo è superare una serie di sfide casuali indovinando correttamente il risultato della carta successiva.</p>
        <ul>
          <li>Puoi scegliere la <strong>puntata iniziale</strong> tra €0.10, €0.20, €0.50, €1, €2 e €5.</li>
          <li>Puoi anche scegliere la <strong>difficoltà</strong>: Facile, Media o Difficile (più sfide, meno jolly).</li>
          <li>Ogni turno una carta viene pescata e ti viene proposta una sfida.</li>
          <li>Ogni risposta corretta ti fa avanzare di una <strong>tappa</strong>.</li>
          <li>Dopo 3 risposte corrette consecutive, ricevi un <strong>jolly</strong>.</li>
          <li>3 errori terminano la partita. Puoi ricominciare con il pulsante 🔁.</li>
        </ul>`
    },
    en: {
      title: "Card Step",
      start: "🎮 Start Game",
      restart: "🔁 Restart",
      rules: "📜 Rules",
      currentCard: "Current card:",
      challenge: "Challenge",
      higher: "Higher",
      lower: "Lower",
      even: "Even",
      odd: "Odd",
      in: "In",
      out: "Out",
      correct: "Correct",
      error: "Errors",
      jolly: "Jokers",
      useJolly: "Use Joker",
      stage: "Stage",
      points: "Points:",
      bet: "Bet:",
      risk: "Risk mode:",
      lost: "You lost!",
      rulesText: `<p>Welcome to <strong>Card Step</strong>! Your goal is to overcome a series of random challenges by guessing the result of the next card correctly.</p>
        <ul>
          <li>You can choose the <strong>initial bet</strong> among $0.10, $0.20, $0.50, $1, $2, and $5.</li>
          <li>You can also select <strong>difficulty</strong>: Easy, Medium, or Hard (more challenges, fewer jokers).</li>
          <li>Each turn, a card is drawn and you are given a challenge.</li>
          <li>Each correct answer advances you one <strong>stage</strong>.</li>
          <li>After 3 consecutive correct answers, you earn a <strong>joker</strong>.</li>
          <li>3 errors end the game. You can restart with the 🔁 button.</li>
        </ul>`
    }
  };
  return t[currentLanguage][key] || key;
}

updateLanguage();
