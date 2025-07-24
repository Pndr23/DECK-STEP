let tappe = 0;
let currentCard = null;
let nextCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;
let usedJolly = false;
let currentLanguage = "it";
let puntataIniziale = parseFloat(document.getElementById("bet").value);
let moltiplicatori = []; 
const moltiplicatoriFacile = [1.1,1.2,1.3,1.5,1.8,2,2.2,2.5,3,5];
const moltiplicatoriMedio = [1.2,1.5,2,2.5,3,3.5,4,5,7,10];
const moltiplicatoriDifficile = [1.5,2,2.5,3,4,5,6,8,12,40];
function aggiornaMoltiplicatori() {
  const livello = document.getElementById("risk").value;
  console.log("aggiornaMoltiplicatori chiamata, livello:", livello);
  if (livello === "easy") {
    moltiplicatori = moltiplicatoriFacile;
  } else if (livello === "medium") {
    moltiplicatori = moltiplicatoriMedio;
  } else if (livello === "hard") {
    moltiplicatori = moltiplicatoriDifficile;
  }
  console.log("Moltiplicatori aggiornati a:", moltiplicatori);
  const multiplierLabels = document.querySelectorAll(".multiplier-label");
  multiplierLabels.forEach((label, index) => {
    if (moltiplicatori[index]) {
      label.textContent = "x" + moltiplicatori[index];
      label.classList.remove("jackpot");
    }
  });
  aggiornaGuadagno(correctCount);
}
document.getElementById("risk").addEventListener("change", () => {
  console.log("Difficoltà cambiata a:", document.getElementById("risk").value);
  aggiornaMoltiplicatori();
});
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
 aggiornaMoltiplicatori();
  preloadCardImages();
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
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("drawnCardImg").src = "";
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
function updateProgress() {
  const steps = progressPath.querySelectorAll(".progress-step");

  steps.forEach((step, i) => {
    const circle = step.querySelector(".circle");
    circle.classList.remove("completed-step");
    if (i < tappe) {
      circle.classList.add("completed-step");
    }
  });
  progressCounter.textContent = `${translate("stage")}: ${tappe}`;
}
function updateJollyButton() {
  useJollyBtn.classList.toggle("hidden", jollyCount === 0 || errorCount === 0);
}
function preloadCardImages() {
  for (let i = 1; i <= 40; i++) {
    const img = new Image();
    img.src = `cards/card_${i}.png`;
  }
  const back = new Image();
  back.src = "cards/card_back.png";
}
function startGame() {
  currentCard = drawCard();
  displayCurrentCard(currentCard);
  displayDrawnCard(null, true);
  generateChallenge();
}
function drawCard(avoidValue = null) {
  const suitsLetters = ['C', 'P', 'F', 'Q'];
  let index, value, suitLetter;
  do {
    index = Math.floor(Math.random() * 40) + 1;
    value = ((index - 1) % 10) + 1;
    const suitIndex = Math.floor((index - 1) / 10);
    suitLetter = suitsLetters[suitIndex];
  } while (value === avoidValue);
  return { value, suit: suitLetter };
}
function displayCurrentCard(card) {
   currentCardImg.src = `cards/card_${card.value}${card.suit}.png`;
}
function displayDrawnCard(card, covered = false) {
  const drawnCardImg = document.getElementById("drawnCardImg");
  if (covered || !card) {
    drawnCardImg.src = "cards/card_back.png";
  } else {
    drawnCardImg.src = `cards/card_${card.value}${card.suit}.png`;
  }
}

function generateChallenge() {
  displayDrawnCard(null, true);
  const challenges = [
    { key: "higherLower", label: { it: "Maggiore o Minore", en: "Higher or Lower" } },
    { key: "evenOdd", label: { it: "Pari o Dispari", en: "Even or Odd" } },
    { key: "inOut", label: { it: "Dentro o Fuori", en: "In or Out" } },
    { key: "exactNumber", label: { it: "Numero Esatto", en: "Exact Number" } }
  ];
  const selected = challenges[Math.floor(Math.random() * challenges.length)];
  const label = selected.label[currentLanguage];
  challengeText.textContent = `${translate("challenge")}: ${label}`;
  challengeButtons.innerHTML = "";
  const lockedValue = currentCard.value;
  if (selected.key === "higherLower") {
    addButton(translate("higher"), (next) => next.value > lockedValue);
    addButton(translate("lower"), (next) => next.value < lockedValue);
  } else if (selected.key === "evenOdd") {
    addButton(translate("even"), (next) => next.value % 2 === 0);
    addButton(translate("odd"), (next) => next.value % 2 !== 0);
  } else if (selected.key === "inOut") {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addButton(translate("in"), (next) => next.value >= a && next.value <= b);
    addButton(translate("out"), (next) => next.value < a || next.value > b);
  } else if (selected.key === "exactNumber") {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString(), (next) => next.value === i);
    }
  }
}
function showGameOverScreen() {
  const screen = document.getElementById("gameOverScreen");
  const gameOverText = document.getElementById("gameOverText");
  gameOverText.textContent = translate("lost") || "Hai perso!";
  screen.style.display = "flex";
  screen.classList.remove("hidden");
  const gameArea = document.getElementById("gameArea");
  const gameSetup = document.getElementById("gameSetup");
  if (gameArea) gameArea.classList.add("hidden");
  if (gameSetup) gameSetup.classList.add("hidden");
}
function addButton(text, checkFn) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.classList.add("green-button");
  btn.style.color = "white";
  btn.onclick = () => {
    console.log("clicked", text);
    const drawnCard = drawCard(currentCard.value);
    const drawnImg = document.getElementById("drawnCardImg");
    displayDrawnCard(null, true);
    setTimeout(() => {
      displayDrawnCard(drawnCard, false); 
      drawnImg.classList.add("card-flip");
      drawnImg.addEventListener("animationend", () => {
        drawnImg.classList.remove("card-flip");
        const result = checkFn(drawnCard);
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
        if (errorCount >= 3) {
          challengeText.textContent = translate("lost");
          challengeButtons.innerHTML = "";
          restartBtn.classList.remove("hidden");
          withdrawBtn.classList.add("hidden");
          showGameOverScreen();
          return;
        }
        if (tappe + 1 >= 10)  {
          showWinScreen();
          fineGioco();
          return;
        }
        updateScore();
        updateProgress();
        updateJollyButton();
        aggiornaGuadagno(correctCount);
        currentCard = drawnCard;
        const isJackpot = tappe === 10;
        const isFirstTurn = correctCount === 1;
        const isUsingJolly = usedJolly;

        if (isFirstTurn || isUsingJolly || isJackpot) {
          setTimeout(() => {
            displayCurrentCard(currentCard);
            displayDrawnCard(null, true);
            showShuffleAnimation(() => {
              generateChallenge();
            });
          }, 2000);
        } else {
          setTimeout(() => {
            displayDrawnCard(null, true);
            displayCurrentCard(currentCard);
            generateChallenge();
          }, 1500);
        }
      }, { once: true });
    }, 700);
  };
  challengeButtons.appendChild(btn);
}
function aggiornaGuadagno(corretti) {
  const label = document.getElementById("gainLabel");
  let guadagno = puntataIniziale;
  console.log("aggiornaGuadagno: corretti =", corretti, "moltiplicatori =", moltiplicatori);
  for (let i = 0; i < corretti && i < moltiplicatori.length; i++) {
    guadagno *= moltiplicatori[i];
  }
  console.log("Guadagno calcolato:", guadagno);
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
function showShuffleAnimation(callback) {
  const shuffleDiv = document.getElementById("shuffleAnimation");
  shuffleDiv.classList.remove("hidden");
  requestAnimationFrame(() => {
    shuffleDiv.classList.add("visible");
  });
  setTimeout(() => {
    shuffleDiv.classList.remove("visible");
    setTimeout(() => {
      shuffleDiv.classList.add("hidden");
      if (callback) callback();
    }, 500);
  }, 1000);
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
      withdraw: "RITIRA"
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
  aggiornaMoltiplicatori();
    document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    startGame(); 
  });
   });
function fineGioco() {
  console.log("🎉 Fine del gioco!");
  gameArea.classList.add("hidden");
  gameSetup.classList.add("hidden");
  const victoryScreen = document.getElementById("victoryScreen");
  victoryScreen.classList.remove("hidden");
  const vincitaFinale = calcolaGuadagno(correctCount);
  const totalWinnings = document.getElementById("totalWinnings");
  totalWinnings.textContent = `Hai vinto: € ${vincitaFinale.toFixed(2)}`;
}
function calcolaGuadagno(corretti) {
  let guadagno = puntataIniziale;
  for (let i = 0; i < corretti && i < moltiplicatori.length; i++) {
    guadagno *= moltiplicatori[i];
  }
  return guadagno;
}
function showWinScreen() {
  const screen = document.getElementById("victoryScreen");
  const winText = document.getElementById("winText");
  const victoryText = document.getElementById("victoryText");
  const totalWinnings = document.getElementById("totalWinnings");
  const gameOverText = document.getElementById("gameOverText"); 
  const gameOverScreen = document.getElementById("gameOverScreen");
  const vincitaFinale = calcolaGuadagno(correctCount);
  winText.classList.remove("hidden");
  if(gameOverText) gameOverText.classList.add("hidden");
  if(gameOverScreen) gameOverScreen.classList.add("hidden");
  totalWinnings.textContent = `Hai vinto: €${vincitaFinale.toFixed(2)}`;
  screen.classList.remove("hidden");
  }
  document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});

