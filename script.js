let tappe = 0;
let minigiocoAttivo = false;
let minigiocoCallback = null;
let moltiplicatoreBonus = 0;
let currentCard = null;
let nextCard = null;
let correctCount = 0;
let errorCount = 0;
let jollyCount = 0;
let correctStreak = 0;
let jollyUsedInThisTurn = false;
let currentLanguage = "it";
let currentLevel = "easy";
let puntataIniziale = parseFloat(document.getElementById("bet").value);
let moltiplicatori = []; 
const moltiplicatoriFacile = [1.1,1.2,1.3,1.5,1.8,2,2.2,2.5,3,5];
const moltiplicatoriMedio = [1.2,1.5,2,2.5,3,3.5,4,5,7,10];
const moltiplicatoriDifficile = [1.5,2,2.5,3,4,5,6,8,12,40];
let gameAreaOriginalDisplay = null;
let gameEnded = false;
let partitaIniziata = false;
function showMinigiocoJolly(callback) {
  if (minigiocoAttivo) return;
  minigiocoAttivo = true;
  minigiocoCallback = callback;
  const popup = document.getElementById("minigiocoJolly");
  const gameArea = document.getElementById("gameArea");
   if (gameAreaOriginalDisplay === null) {
  gameAreaOriginalDisplay = getComputedStyle(gameArea).display;
  }
  gameArea.style.display = "none";
  popup.style.display = "flex"; 
  popup.style.flexDirection = "column";
  popup.style.alignItems = "center";
  popup.style.justifyContent = "center";
  popup.style.paddingTop = "20"; 
  popup.style.width = "100%";
  popup.style.height = "100vh";    
  popup.style.backgroundColor = "black";
  popup.style.backgroundImage = "url('sfondomini.png')";
  popup.style.backgroundPosition = "center";
  popup.style.backgroundSize = "cover";
  popup.style.marginTop = "0";       
  popup.style.marginBottom = "0";
  const title = document.getElementById("minigiocoTitle");
  const cardElems = [document.getElementById("minicard1"), document.getElementById("minicard2")];
  const closeBtn = document.getElementById("minigiocoCloseBtn");
  function resizeMinigioco() {
  let screenWidth = window.innerWidth;
  if (title) {
    title.style.order = "1";
    title.style.fontSize = screenWidth < 600 ? "1.2em" : "2em";
    title.style.color = "white";
   title.style.marginBottom = screenWidth < 600 ? "10px" : "20px";
  }
  cardElems.forEach(c => {
      c.style.order = "2";
      if (screenWidth < 600) { 
        c.style.width = "110px";
        c.style.height = "165px";
        c.style.margin = "0 8px";
      } else { // desktop
        c.style.width = "180px";
        c.style.height = "260px";
        c.style.margin = "0 15px";
      }
    });
  if (closeBtn) {
    closeBtn.style.order = "3";
     closeBtn.style.marginTop = screenWidth < 600 ? "15px" : "30px";
    closeBtn.style.fontSize = screenWidth < 600 ? "0.9em" : "1.2em";
    closeBtn.style.padding = screenWidth < 600 ? "6px 12px" : "10px 20px";
  }
      }
   resizeMinigioco();
  window.addEventListener("resize", resizeMinigioco);
  const jollyImgSrc = "jolly.png";
  const moltiplicatoriMinigioco = [1,2,3,4,5,6,7,8,9,10];
  const moltiplicatoreScelto = moltiplicatoriMinigioco[Math.floor(Math.random() * moltiplicatoriMinigioco.length)];
  const suitsLetters = ['C', 'P', 'F', 'Q'];
  const index = Math.floor(Math.random() * 40) + 1;
  const value = ((index - 1) % 10) + 1;
  const suitIndex = Math.floor((index - 1) / 10);
  const suitLetter = suitsLetters[suitIndex];
  const moltiplicatoreImgSrc = `cards/card_${value}${suitLetter}.png`;
  let carte = [
    {type: "jolly", img: jollyImgSrc},
    {type: "moltiplicatore", img: moltiplicatoreImgSrc, value: moltiplicatoreScelto}
  ];
  carte.sort(() => Math.random() - 0.5);
  cardElems.forEach((el, i) => {
    el.src = "cards/card_back.png";
    el.classList.remove("flipped", "selected");
    el.classList.add("covered");
    el.style.borderColor = "transparent";
    el.style.cursor = "pointer";
    el.dataset.type = carte[i].type;
    el.dataset.img = carte[i].img;
    if (carte[i].type === "moltiplicatore") el.dataset.value = carte[i].value;
    el.onclick = () => {
      if (!minigiocoAttivo) return;
      minigiocoAttivo = false;
      cardElems.forEach(c => c.classList.remove("covered"));
      el.classList.add("flipped");
      el.style.cursor = "default";
      setTimeout(() => {
        el.src = el.dataset.img;
        el.classList.add("selected");
      }, 300);
      cardElems.forEach(otherEl => {
        if (otherEl !== el) {
          otherEl.classList.remove("covered");
          otherEl.src = otherEl.dataset.img;
          otherEl.style.cursor = "default";
        }
        otherEl.onclick = null;
      });
      setTimeout(() => {
        if (minigiocoCallback) minigiocoCallback(el.dataset.type, parseInt(el.dataset.value || "0"));
         
    if (el.dataset.type === "jolly") {
     const jollyBtn = document.getElementById("jollyButton");
     if (jollyBtn) jollyBtn.style.display = "block";
     hasJolly = true;
  }
        minigiocoCallback = null;
        popup.style.display = "none";
       gameArea.style.display = gameAreaOriginalDisplay;
       window.removeEventListener("resize", resizeMinigioco);
      }, 1700);
    };
  });
   closeBtn.onclick = () => {
    if (!minigiocoAttivo) return;
    minigiocoAttivo = false;
    minigiocoCallback = null;
    popup.style.display = "none";
    gameArea.style.display = gameAreaOriginalDisplay;
    window.removeEventListener("resize", resizeMinigioco);
  };
}
function aggiornaMoltiplicatori() {
  const livello = document.getElementById("risk").value;
  console.log("aggiornaMoltiplicatori chiamata, livello:", livello);
   currentLevel = livello; 
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
  currentLevel = document.getElementById("risk").value;  
  console.log("Difficoltà cambiata a:", currentLevel);
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
  document.querySelector(".container").classList.add("hidden");
  document.getElementById("gameOverScreen")?.classList.add("hidden");
  document.getElementById("withdrawText").textContent = "Hai ritirato!";
  document.getElementById("withdrawWinnings").textContent =
    `Hai incassato: €${calcolaGuadagno(correctCount).toFixed(2)}`;
  document.getElementById("withdrawScreen").classList.remove("hidden");
});
function resetGame() {
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("drawnCardImg").src = "";
  partitaIniziata = false
  gameEnded = false;
  correctCount = 0;
  errorCount = 0;
  jollyCount = 0;
  tappe = 0;
  correctStreak = 0;
  moltiplicatoreBonus = 0;
  jollyUsedInThisTurn = false;
  updateScore();
  updateProgress();
  updateJollyButton();
}
function updateJollyDisplay() {
  document.getElementById("jollyCount").textContent = jollyCount;
  if (jollyCount > 0) {
    document.getElementById("useJollyBtn").classList.remove("hidden");
  } else {
    document.getElementById("useJollyBtn").classList.add("hidden");
  }
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
    step.classList.remove("completed-step");
    if (i < tappe) {
      void step.offsetWidth;
      step.classList.add("completed-step");
    }
  });
  progressCounter.textContent = `${translate("stage")}: ${tappe}`;
    const activeStep = steps[tappe - 1];
  if (activeStep) {
 progressPath.scrollLeft = activeStep.offsetLeft - progressPath.offsetWidth / 2 + activeStep.offsetWidth / 2;
  }
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
   console.log("startGame chiamato");  // Controlla se la funzione viene eseguita
   console.log("Stato schermata gioco:", gameScreen.hidden);
  partitaIniziata = true;
  gameEnded = false;
  tappe = 0;
  errorCount = 0; 
  correctCount = 0;
  correctStreak = 0;
  jollyCount = 0;
  moltiplicatoreBonus = 0;
  jollyUsedInThisTurn = false;
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
  }
    while (value === avoidValue);
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
function isRed(suit) {
  return suit === "C" || suit === "Q";
} 
function isBlack(suit) {
  return suit === "F" || suit === "P";
}
function generateChallenge() {
  displayDrawnCard(null, true);
  let challenges = [
    { key: "higherLower", label: { it: "Maggiore o Minore", en: "Higher or Lower" } },
    { key: "evenOdd", label: { it: "Pari o Dispari", en: "Even or Odd" } },
    { key: "inOut", label: { it: "Dentro o Fuori", en: "In or Out" } },
    { key: "exactNumber", label: { it: "Numero Esatto", en: "Exact Number" } },
    { key: "color", label: { it: "Colore", en: "Color" } },
    { key: "suit", label: { it: "Seme", en: "Suit" } } // Nuova sfida
  ]; 
  if (currentLevel === "hard") {
    challenges = challenges.filter(ch => ch.key !== "color");
  } else {
    challenges = challenges.filter(ch => ch.key !== "exactNumber");
  }
  const selected = challenges[Math.floor(Math.random() * challenges.length)];
  const label = selected.label[currentLanguage];
  challengeText.textContent = `${translate("challenge")}: ${label}`;
  challengeButtons.innerHTML = "";
  const lockedValue = currentCard.value;
  const lockedSuit = currentCard.suit;
  if (selected.key === "higherLower") {
    addButton(translate("higher"), (next) => next.value > lockedValue);
    addButton(translate("lower"), (next) => next.value < lockedValue);
  } else if (selected.key === "evenOdd") {
    addButton(translate("even"), (next) => next.value % 2 === 0);
    addButton(translate("odd"), (next) => next.value % 2 !== 0);
  } else if (selected.key === "inOut") {
    const a = Math.floor(Math.random() * 7) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    addButton(translate("in"), (next) => next.value >= a && next.value <= b);
    addButton(translate("out"), (next) => next.value < a || next.value > b);
  } else if (selected.key === "exactNumber") {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString(), (next) => next.value === i);
    }
  } else if (selected.key === "color") {
    addButton(translate("red"), (next) => next.suit === "C" || next.suit === "Q");
    addButton(translate("black"), (next) => next.suit === "F" || next.suit === "P");
  } else if (selected.key === "suit") {
    addButton(translate("hearts"), (next) => next.suit === "C");
    addButton(translate("diamonds"), (next) => next.suit === "Q");
    addButton(translate("clubs"), (next) => next.suit === "F");
    addButton(translate("spades"), (next) => next.suit === "P");
  }
}  
document.addEventListener("DOMContentLoaded", () => {
  currentLanguage = navigator.language.startsWith("en") ? "en" : "it";
  languageSelect.value = currentLanguage;
  currentLevel = document.getElementById("risk").value; // inizializza currentLevel all'avvio
  updateLanguage();
  aggiornaMoltiplicatori();
  document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    startGame();
  });
});
function showGameOverScreen() {
  const screen = document.getElementById("gameOverScreen");
  const gameOverText = document.getElementById("gameOverText");
  if (screen) {
    screen.classList.remove("hidden");
  }
  if (gameOverText) {
    gameOverText.textContent = translate("lost") || "Hai perso!";
  }
  gameArea.classList.add("hidden");
  gameSetup.classList.add("hidden");
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
          correctStreak++;
  if (correctStreak === 3){
  correctStreak = 0;
    showMinigiocoJolly((scelta, valore) => {
    if (scelta === "jolly") {
      jollyCount++;
      updateJollyDisplay();
      alert("Hai vinto un Jolly!");
  document.getElementById("useJollyBtn").classList.remove("hidden");
} else if (scelta === "moltiplicatore") {
      alert(`Hai vinto un moltiplicatore bonus x${valore}! Sarà sommato al guadagno.`);
      moltiplicatoreBonus += valore;
    }
    updateScore();
    updateJollyButton();
  });
  }    
   } else {
          correctStreak = 0; 
          if (jollyCount > 0 && errorCount < 3) {
            jollyCount--;
          } else {
            errorCount++;
            if (jollyCount > 0 && errorCount === 3 && !jollyUsedInThisTurn) {
              jollyCount--;
              errorCount--; 
              updateJollyDisplay();
              jollyUsedInThisTurn = true;
              alert("Jolly usato automaticamente!");
            }
          }
        }
        if (!gameEnded) {
          const maxErrors = (currentLevel === "hard") ? 3 : 4;
          if (errorCount >= maxErrors) {
            gameEnded = true;
            challengeText.textContent = translate("lost");
            challengeButtons.innerHTML = "";
            restartBtn.classList.remove("hidden");
            withdrawBtn.classList.add("hidden");
            showGameOverScreen();
            } else if (tappe >= 10 && !gameEnded) {
            gameEnded = true;
            fineGioco();
          }
        }
        if (!gameEnded) generateChallenge();
        updateScore();
        updateProgress();
        updateJollyButton();
        aggiornaGuadagno(correctCount);
        currentCard = drawnCard;
        setTimeout(() => {
          displayCurrentCard(currentCard);
          displayDrawnCard(null, true);
        }, 1500);
      }, { once: true });
    }, 700);
  };
  challengeButtons.appendChild(btn);
}
function aggiornaGuadagno(corretti) {
  const label = document.getElementById("gainLabel");
  let guadagno = puntataIniziale;
  for (let i = 0; i < corretti && i < moltiplicatori.length; i++) {
    guadagno *= moltiplicatori[i];
  }
 guadagno += moltiplicatoreBonus * puntataIniziale; 
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
function showShuffle(callback) {
  const shuffle = document.getElementById('shuffleContainer');
  shuffle.classList.remove('hidden');
  shuffle.style.pointerEvents = 'auto';
  setTimeout(() => {
    shuffle.classList.add('hidden');
    shuffle.style.pointerEvents = 'none';
    if (callback) callback();
  }, 2000);
}
function translate(key) {
  const t = {
    it: {
      red: "Rosso",
      black: "Nero",
      hearts: "Cuori",
      diamonds: "Quadri",
      clubs: "Fiori",
      spades: "Picche",
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
     red: "Red",
     black: "Black",
     hearts: "Hearts",
     diamonds: "Diamonds",
     clubs: "Clubs",
     spades: "Spades",
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
function calcolaGuadagno(corretti) {
  let guadagno = puntataIniziale;
  for (let i = 0; i < corretti && i < moltiplicatori.length; i++) {
    guadagno *= moltiplicatori[i];
  }
  return guadagno;
}
document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("useJollyBtn").addEventListener("click", () => {
  if (jollyCount > 0 && !jollyUsedInThisTurn) {
    jollyCount--;
    updateJollyDisplay();
    jollyUsedInThisTurn = true;
    alert("Hai usato il Jolly manualmente!");
  }
});
document.getElementById("restartBtnWithdraw").addEventListener("click", () => {
  location.reload(); 
});
