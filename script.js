let tappe = 0;
let currentCard = null;
let nextCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;
let usedJolly = false;
let currentLanguage = "it";
let puntataIniziale = parseFloat(document.getElementById("bet").value);// valore di default, verrà aggiornato quando selezioni una puntata
let moltiplicatori = [1.2, 1.5, 2, 3, 20, 5, 8, 12, 40, 100];

const withdrawBtn = document.getElementById("withdrawBtn");
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
const selectBet = document.getElementById("bet");

selectBet.addEventListener("change", () => {
puntataIniziale = parseFloat(selectBet.value);
});


rulesToggle.addEventListener("click", () => {
  rulesPanel.classList.toggle("hidden");
});

startButton.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  withdrawBtn.classList.remove("hidden");
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

withdrawBtn.addEventListener("click", () => {
  challengeButtons.innerHTML = "";
  const message = translate("withdrawn").replace("{points}", correctCount);
  challengeText.textContent = message;
  withdrawBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
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
  if (currentCard === null) {
    currentCard = drawCard();
    displayCard(currentCard);
  }
  nextCard = drawCard();
  generateChallenge();
}

function drawCard() {
  const index = Math.floor(Math.random() * 40);
  const value = (index % 10) + 1;
  const suit = Math.floor(index / 10); // 0,1,2,3 per i semi
  return { value, suit, index }; // 👈 AGGIUNGI index
}

function displayCard(card) {
  currentCardImg.src = `cards/card_${card.index}.png`;
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
    addButton(translate("higher"), (next) => next.value> currentCard.value);
    addButton(translate("lower"), (next) => next.value < currentCard.value);
  } else if (label === translate("even") + " o " + translate("odd")) {
    addButton(translate("even"), (next) => next.value % 2 === 0);
    addButton(translate("odd"),  (next) => next.value % 2 !== 0);
  } else if (label === translate("in") + " o " + translate("out")) {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addButton(translate("in"), (next) => next.value >= a && next.value <= b);
    addButton(translate("out"), (next) => next.value < a || next.value > b);
  } else {
    for (let i = 1; i <= 10; i++) {
      addButton(i, (next) => next.value === i);
    }
  }
}

function addButton(text, checkFn) {
  const btn = document.createElement("button");
  btn.textContent = text;
 
  btn.style.color = "white";

  const lower = translate("lower");
  const odd = translate("odd");
  const out = translate("out");

  if (text === lower || text === odd || text === out) {
    btn.classList.add("red-button");
  } else {
    btn.classList.add("green-button"); 
  }

  btn.onclick = () => {
    const result = checkFn(nextCard);
    if (result) {
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

    currentCard = nextCard;
    displayCard(currentCard);
    nextCard = drawCard();

    updateScore();
    updateProgress();
    updateJollyButton();
    aggiornaGuadagno(correctCount);
    
    if (errorCount >= 3) {
      challengeText.textContent = translate("lost");
      challengeButtons.innerHTML = "";
      restartBtn.classList.remove("hidden");
      withdrawBtn.classList.add("hidden");
    } else {
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
    
    const circle = document.createElement("div");
    circle.classList.add("circle");
    if (i < tappe) {
   void circle.offsetWidth; // forza il reflow
   circle.classList.add("completed-step");
   } else if (i === tappe) {
  // Questa è la tappa attuale
   circle.classList.add("current-step");
 }
  step.appendChild(circle);
    
    const label = document.createElement("div");
    label.classList.add("multiplier-label");
    label.textContent = "x" + multipliers[i].toFixed(2);

    wrapper.appendChild(step);
    wrapper.appendChild(label);
    progressPath.appendChild(wrapper);
  }
    // --- QUI: aggiungo la scritta JACKPOT sopra la decima tappa ---
const steps = progressPath.querySelectorAll(".progress-step");
if (steps.length >= 10) {
  const tenthStep = steps[9];
  
  // Prendo il wrapper (genitore) della decima tappa
  const tenthWrapper = tenthStep.parentNode;
  
  // Imposto il wrapper come relativo per contenere l'assoluto
  tenthWrapper.style.position = "relative";

  const jackpotLabel = document.createElement("div");
  jackpotLabel.textContent = "🎉 JACKPOT 🎉";
  jackpotLabel.style.fontWeight = "bold";
  jackpotLabel.style.color = "#FFD700";  // colore oro
  jackpotLabel.style.textAlign = "center";
  jackpotLabel.style.fontSize = "18px"; 
  // Posiziona il testo sopra senza spostare elementi
  jackpotLabel.style.position = "absolute";
  jackpotLabel.style.top = "-20px"; // alza sopra la tappa, aggiusta se serve
  jackpotLabel.style.left = "50%";
  jackpotLabel.style.transform = "translateX(-50%)";
  jackpotLabel.style.whiteSpace = "nowrap";

  tenthWrapper.appendChild(jackpotLabel);
}
}
    function aggiornaGuadagno(corretti) {
  const label = document.getElementById("gainLabel");
  let guadagno = puntataIniziale;

for (let i = 0; i < corretti && i < moltiplicatori.length; i++) {
  guadagno *= moltiplicatori[i]; // fallback a 1 se oltre i limiti
  }

  label.textContent = "+€" + guadagno.toFixed(2);
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
  document.getElementById("withdrawLabel").textContent = translate("withdraw");
}

function translate(key) {
  const t = {
    it: {
      title: "Deck Step",
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
      rulesText: `<p>Benvenuto in <strong>Deck Step</strong>! Il tuo obiettivo è superare una serie di sfide casuali indovinando correttamente il risultato della carta successiva.</p>
        <ul>
          <li>Puoi scegliere la <strong>puntata iniziale</strong> tra €0.10, €0.20, €0.50, €1, €2 e €5.</li>
          <li>Puoi anche scegliere la <strong>difficoltà</strong>: Facile, Media o Difficile (più sfide, meno jolly).</li>
          <li>Ogni turno una carta viene pescata e ti viene proposta una sfida.</li>
          <li>Ogni risposta corretta ti fa avanzare di una <strong>tappa</strong>.</li>
          <li>Dopo 3 risposte corrette consecutive, ricevi un <strong>jolly</strong>.</li>
          <li>3 errori terminano la partita. Puoi ricominciare con il pulsante 🔁.</li>
        </ul>`,
      withdrawn: "Hai ritirato! Hai totalizzato {points} punti.",
      withdraw: "RITIRA", 
    },
    en: {
      withdrawn: "You withdrew! You earned {points} points.",
      title: "Deck Step",
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
      jolly: "Joker",
      useJolly: "Use Joker",
      stage: "Stage",
      points: "Points:",
      bet: "Bet:",
      risk: "Risk mode:",
      lost: "You lost!",
      withdraw: "WITHDRAW",
      rulesText: `<p>Welcome to <strong>Deck Step</strong>! Your goal is to complete a series of random challenges by correctly guessing the next card.</p>
        <ul>
          <li>You can choose your <strong>starting bet</strong> from €0.10 to €5.</li>
          <li>Select a <strong>difficulty</strong>: Easy, Medium, or Hard (more challenges, fewer jokers).</li>
          <li>Each turn draws a card and gives you a challenge.</li>
          <li>Correct answers advance you a <strong>stage</strong>.</li>
          <li>After 3 correct answers in a row, you earn a <strong>joker</strong>.</li>
          <li>3 mistakes end the game. Use 🔁 to restart.</li>
        </ul>`
    }
  };
  return t[currentLanguage][key];
}

document.addEventListener("DOMContentLoaded", () => {
  currentLanguage = navigator.language.startsWith("en") ? "en" : "it";
  languageSelect.value = currentLanguage;
  updateLanguage();
});
