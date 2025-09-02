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
const moltiplicatoriFacile = [1.1,1.2,1.3,1.5,1.8,2,2.2,2.5,3,5];
const moltiplicatoriMedio = [1.2,1.3,1.5,1.7,2,2.2,2.5,3,3.5,4,4.5,5,6,7,10];
const moltiplicatoriDifficile = [1.5,1.6,1.8,2,2.2,2.5,3,3.5,4,5,6,7,8,9,10,12,15,20,30,40];
const soundClick = new Audio('click.mp3');
const soundWithdraw = new Audio('withdraw.mp3');
const soundWin = new Audio('win.mp3');
const soundLose = new Audio('lose.mp3');
const soundCorrect = new Audio('correct.mp3');
const soundWrong = new Audio('wrong.mp3');
const soundFlip = new Audio("flip.mp3");
let audioOn = true;
let moltiplicatori = {
  easy: moltiplicatoriFacile,
  medium: moltiplicatoriMedio,
  hard: moltiplicatoriDifficile
};
const tappeMassime = {
  easy: 10,
  medium: 15,
  hard: 20
};
function playSound(sound) {
  if (audioOn) { 
    sound.currentTime = 0;
    sound.play();
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const soundToggle = document.getElementById("soundToggle");
  if (!soundToggle) return; // se non esiste, esco subito
  soundToggle.addEventListener("click", (event) => {
    event.stopPropagation(); // blocca il click dall'arrivare al resto della pagina
    audioOn = !audioOn;
    soundToggle.textContent = audioOn ? "🔊" : "🔇";
  });
  function positionMuteBtn() {
    soundToggle.style.position = "fixed";
    soundToggle.style.bottom = "20px";
    soundToggle.style.left = "20px";
  }
  positionMuteBtn();
  window.addEventListener("resize", positionMuteBtn);
});
let gameAreaOriginalDisplay = null;
let gameEnded = false;
let partitaIniziata = false;
let jollyFromMinigioco = false;
let HISTORY_KEY = 'deckstep_history_v1';
let activeSession = null;
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}
function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
function startHistorySession() {
  const list = loadHistory();
  activeSession = {
    id: Date.now(),
    startedAt: new Date().toISOString(),
    events: [],
    outcome: null,
    winnings: 0
  };
  list.push(activeSession);
  saveHistory(list);
  renderHistory();
}
function logHistoryEvent(eventText) {
  if (!activeSession) return;
  const list = loadHistory();
  const s = list.find(x => x.id === activeSession.id);
  if (!s) return;
  s.events.push({ at: new Date().toISOString(), text: eventText });
  saveHistory(list);
  renderHistory();
}
function finalizeHistorySession(outcome, winnings=0) {
  if (!activeSession) return;
  const list = loadHistory();
  const s = list.find(x => x.id === activeSession.id);
  if (!s) return;
  s.outcome = outcome;
  s.winnings = winnings;
  s.endedAt = new Date().toISOString();
  saveHistory(list);
  activeSession = null;
  renderHistory();
}
function initHistoryUI() {
  const panel = document.getElementById('historyPanel');
  const openBtn = document.getElementById('historyButton');
  const closeBtn = document.getElementById('historyClose');
  const clearBtn = document.getElementById('historyClear');
  const backdrop = document.getElementById('historyBackdrop');
  if (openBtn) openBtn.addEventListener('click', () => { panel.classList.remove('hidden'); renderHistory(); });
  if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
  if (backdrop) backdrop.addEventListener('click', () => panel.classList.add('hidden'));
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Sicuro di cancellare la cronologia?')) {
      localStorage.removeItem(HISTORY_KEY);
      activeSession = null;
      renderHistory();
    }
  });
}
function renderHistory() {
  const listEl = document.getElementById('historyList');
  if (!listEl) return;
  const items = loadHistory().slice().reverse();
  if (items.length === 0) {
    listEl.innerHTML = '<p style="opacity:.7">Nessuna partita salvata.</p>';
    return;
  }
  listEl.innerHTML = items.map(s => `
    <div class="history-card">
      <div class="history-row">
        <strong>${new Date(s.startedAt).toLocaleString()}</strong>
        <span>${s.outcome||'In corso'} • €${s.winnings||0}</span>
      </div>
      <details>
        <summary>Eventi</summary>
        <ol class="turns">
          ${s.events.map(e => `<li>${e.at}: ${e.text}</li>`).join('')}
        </ol>
      </details>
    </div>
  `).join('');
}
document.addEventListener('DOMContentLoaded', () => {
initHistoryUI();
renderHistory();
function createBetBadge() {
    const gameArea = document.getElementById("gameArea");
    let badge = document.getElementById("betBadge");
    if (!badge) {
        badge = document.createElement("div");
        badge.id = "betBadge";
        badge.style.padding = "6px 12px";
        badge.style.background = "#ffcc00";
        badge.style.color = "#222";
        badge.style.fontWeight = "700";
        badge.style.fontSize = "1.1rem";
        badge.style.borderRadius = "10px";
        badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        badge.style.userSelect = "none";
        badge.style.marginBottom = "8px"; 
        badge.style.textAlign = "center";
        gameArea.insertBefore(badge, gameArea.firstChild);
    }
    puntataIniziale = parseFloat(document.getElementById("bet").value);
    badge.textContent = `Puntata: €${puntataIniziale.toFixed(2)}`;
}

function updateBetBadge() {
    const badge = document.getElementById("betBadge");
    if (badge) {
        puntataIniziale = parseFloat(document.getElementById("bet").value);
        badge.textContent = `Puntata: €${puntataIniziale.toFixed(2)}`;
    }
}
document.getElementById("startButton").addEventListener("click", () => {
createBetBadge(); 
});
function showMinigiocoJolly(callback) {
  if (minigiocoAttivo) return;
  minigiocoAttivo = true;
  minigiocoCallback = callback;
  const popup = document.getElementById("minigiocoJolly");
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
  popup.style.backgroundColor = "#800020";
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
    title.style.fontSize = screenWidth < 600 ? "0.8em" : "1.8em";
    title.style.color = "white";
   title.style.marginBottom = screenWidth < 600 ? "6px" : "15px";
   title.style.textAlign = "center";
  }
  cardElems.forEach(c => {
      c.style.order = "2";
      if (screenWidth < 600) { 
        c.style.width = "90px";
        c.style.height = "150px";
        c.style.margin = "0 4px";
      } else { // desktop
        c.style.width = "160px";
        c.style.height = "230px";
        c.style.margin = "0 12px";
      }
    });
  if (closeBtn) {
    closeBtn.style.order = "3";
     closeBtn.style.marginTop = screenWidth < 600 ? "10px" : "25px";
    closeBtn.style.fontSize = screenWidth < 600 ? "0.75em" : "1.1em";
    closeBtn.style.padding = screenWidth < 600 ?"4px 8px" : "8px 16px";
  }
    popup.style.justifyContent = screenWidth < 600 ? "flex-start" : "center";
  popup.style.paddingTop = screenWidth < 600 ? "10px" : "20px";
}
   resizeMinigioco();
  window.addEventListener("resize", resizeMinigioco);
  const jollyImgSrc = "jolly.png";
  const moltiplicatoriMinigioco = [1,2,3,4,5,6,7,8,9,10];
  const moltiplicatoreScelto = Math.floor(Math.random() * 10) + 1;
  const suitsLetters = ['C', 'P', 'F', 'Q'];
  const index = Math.floor(Math.random() * 40) + 1;
  const value =  moltiplicatoreScelto;
  const suitIndex = Math.floor((index - 1) / 10);
  const suitLetter =  suitsLetters[Math.floor(Math.random() * suitsLetters.length)];
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
       playSound(soundClick);
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
  alert("Hai vinto 1 Jolly!");
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
  currentLevel = livello; 
  creaProgressSteps(); 
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
  const dummy = new Audio('click.mp3');
  dummy.play().catch(() => {});
 startHistorySession(); 
 aggiornaMoltiplicatori();
  preloadCardImages();
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  withdrawBtn.classList.remove("hidden");
  resetGame();
  startGame();
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => playSound(soundClick));
  });
  document.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => playSound(soundClick));
  });
});
restartBtn.addEventListener("click", () => {
  gameSetup.classList.remove("hidden");
  gameArea.classList.add("hidden");
});
useJollyBtn.addEventListener("click", () => {
  if (jollyCount > 0 && !jollyUsedInThisTurn && errorCount < (currentLevel === "hard" ? 3 : 4)) {
    jollyCount--;
    errorCount--;
    jollyUsedInThisTurn = true;
    updateScore();
    updateJollyDisplay();
    alert("Hai usato un Jolly manualmente!");
  }
});
languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  updateLanguage();
});
withdrawBtn.addEventListener("click", () => {
    playSound(soundWithdraw);
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
  jollyCountSpan.textContent = jollyCount;
  if (jollyCount > 0) {
    useJollyBtn.classList.remove("hidden");
  } else {
    useJollyBtn.classList.add("hidden");
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
 function creaProgressSteps() {
  const progressPath = document.getElementById("progressPath");
  progressPath.innerHTML = ""; 
  const numeroTappe = tappeMassime[currentLevel] || 10;
  const livelloKey = String(currentLevel).toLowerCase();
  const moltiplicatoriLivello = moltiplicatori[livelloKey] || [];
  for (let i = 0; i < numeroTappe; i++) {
    const step = document.createElement("div");
    step.classList.add("progress-step");
    const circle = document.createElement("div");
    circle.classList.add("circle");
    step.appendChild(circle);
    const multiplier = document.createElement("div");
    multiplier.classList.add("multiplier-label");
  multiplier.textContent = moltiplicatoriLivello[i] !== undefined ? "x" + moltiplicatoriLivello[i] : "";
    step.appendChild(multiplier);
    progressPath.appendChild(step);
  }
}
function updateJollyButton() {
   useJollyBtn.classList.toggle("hidden", jollyCount === 0);
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
  console.log("Stato schermata gioco:", gameArea.hidden);
  partitaIniziata = true;
  gameEnded = false;
  tappe = 0;
  creaProgressSteps(); 
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
  currentLevel = document.getElementById("risk").value; 
  updateLanguage();
  aggiornaMoltiplicatori();
  document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    startGame();
  });
});
function showGameOverScreen() {
  playSound(soundLose);
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
    playSound(soundClick);
    console.log("clicked", text);

    const drawnCard = drawCard(currentCard.value);
    const cardName = `${drawnCard.value}${drawnCard.suit}`;
    logHistoryEvent(`Hai giocato la carta: ${cardName}`);

    const drawnImg = document.getElementById("drawnCardImg");
    const maxErrors = currentLevel === "hard" ? 3 : 4;

    playSound(soundFlip);
    drawnImg.style.transition = "transform 0.6s ease";
    drawnImg.style.transform = "rotateY(90deg) scale(1.05)";

    setTimeout(() => {
      displayDrawnCard(drawnCard, false);
      drawnImg.style.transform = "rotateY(0deg) scale(1)";

      setTimeout(() => {
        currentCard = drawnCard;
        displayCurrentCard(currentCard);
        displayDrawnCard(null, true);

        const result = checkFn(drawnCard);

        if (result) {
          correctCount++;
          correctStreak++;
          tappe++;
          playSound(soundCorrect);

          if (correctStreak === 3) {
            correctStreak = 0;
            showMinigiocoJolly((scelta, valore) => {
              if (scelta === "jolly") {
                jollyCount++;
                updateJollyDisplay();
              } else if (scelta === "moltiplicatore") {
                moltiplicatoreBonus += valore;
                alert(`Hai vinto un moltiplicatore bonus x${valore}! Sarà sommato al guadagno.`);
                updateScore();
                updateJollyButton();
              }
            });
          }
        } else {
          correctStreak = 0;
          errorCount++;
          tryAutoJolly(maxErrors);

          if (errorCount < maxErrors) {
            playSound(soundWrong);
          }

          if (!gameEnded) {
            if (errorCount >= maxErrors) {
              gameEnded = true;
              challengeText.textContent = translate("lost");
              challengeButtons.innerHTML = "";
              restartBtn.classList.remove("hidden");
              withdrawBtn.classList.add("hidden");
              finalizeHistorySession('Perso', 0);
              showGameOverScreen();
            } else if (tappe === tappeMassime[currentLevel] && result) {
              gameEnded = true;
              const totale = calcolaGuadagno(correctCount);
              finalizeHistorySession('Vinto', totale);
              showVictoryScreen(totale);
            }
          }
        }

        if (!gameEnded) generateChallenge();
        updateScore();
        updateProgress();
        updateJollyButton();
        aggiornaGuadagno(correctCount);

      }, 1500);
    }, 300);
  };

  challengeButtons.appendChild(btn);
}
function showVictoryScreen(vincitaTotale) {
    soundWin.play();
    document.getElementById("gameArea").classList.add("hidden");
    const victoryScreen = document.createElement("div");
    victoryScreen.style.position = "fixed";
    victoryScreen.style.top = "0";
    victoryScreen.style.left = "0";
    victoryScreen.style.width = "100vw";
    victoryScreen.style.height = "100vh";
    victoryScreen.style.background = "#222";
    victoryScreen.style.color = "white";
    victoryScreen.style.display = "flex";
    victoryScreen.style.flexDirection = "column";
    victoryScreen.style.justifyContent = "center";
    victoryScreen.style.alignItems = "center";
    victoryScreen.style.zIndex = "9999";
    const title = document.createElement("h1");
    title.textContent = "🎉 VITTORIA! 🎉";
    title.style.fontSize = "4rem";
    title.style.marginBottom = "20px";
    const prize = document.createElement("p");
    prize.textContent = `Hai vinto ${vincitaTotale} crediti!`; 
    prize.style.fontSize = "1.8rem";
    prize.style.marginBottom = "40px";
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Ricomincia";
    restartBtn.style.fontSize = "1.5rem";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.background = "#28a745";
    restartBtn.style.color = "white";
    restartBtn.style.border = "none";
    restartBtn.style.borderRadius = "10px";
    restartBtn.style.cursor = "pointer";
    restartBtn.onclick = () => {
        location.reload();
    };
    victoryScreen.appendChild(title);
    victoryScreen.appendChild(prize);
    victoryScreen.appendChild(restartBtn);
    document.body.appendChild(victoryScreen);
    for (let i = 0; i < 40; i++) {
        const confetto = document.createElement("div");
        confetto.style.position = "fixed";
        confetto.style.width = "10px";
        confetto.style.height = "10px";
        confetto.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetto.style.top = "-10px";
        confetto.style.left = Math.random() * 100 + "vw";
        confetto.style.opacity = "0.9";
        confetto.style.borderRadius = "50%";
        confetto.style.transition = "transform 2s linear, top 2s linear";
        document.body.appendChild(confetto);
        setTimeout(() => {
            confetto.style.top = "100vh";
            confetto.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 50);
        setTimeout(() => {
            confetto.remove();
        }, 2500);
    }
}
function tryAutoJolly(maxErrors) {
  if (jollyFromMinigioco) {
    jollyFromMinigioco = false;
    return;
  }
  if (jollyCount > 0 && errorCount >= maxErrors && !jollyUsedInThisTurn) {
    jollyCount--;
    errorCount--;
    jollyUsedInThisTurn = true;
    updateJollyDisplay();
    alert("Jolly usato automaticamente!");
    logHistoryEvent("Jolly usato automaticamente!");
  }
}
function aggiornaGuadagno(corretti) {
 const label = document.getElementById("gainLabel");
  let guadagno = puntataIniziale;
  const moltiplicatoriLivello = moltiplicatori[currentLevel]; 
  for (let i = 0; i < corretti && i < moltiplicatoriLivello.length; i++) {
    guadagno *= moltiplicatoriLivello[i];
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
      rulesText: `<p>Benvenuto in <strong>Deck Step</strong>! Il tuo obiettivo è completare 10-15-20 tappe indovinando le carte successive e accumulando vincite.</p>
        <ul>
          <li>Scegli la <strong>puntata iniziale</strong> (€0,10–€5) e la difficoltà (Facile, Media, Difficile).</li>
          <li>Ogni turno pesca una carta e affronta una sfida: Maggiore/Minore, Colore, Seme, Pari/Dispari, Intervallo o Numero Esatto (solo Difficile).</li>
          <li>Dopo 3 risposte corrette consecutive, ottieni un <strong>Jolly</strong> o un <strong>Moltiplicatore Bonus</strong>.</li>
          <li>Puoi riscattare le vincite in qualsiasi momento, oppure continuare fino all'ultima tappa.</li>
          <li>Il numero massimo di errori: Facile/Medio = 4, Difficile = 3. Senza Jolly disponibili, la partita termina.</li>
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
      rulesText: `<p>Welcome to <strong>Deck Step</strong>! Your goal is to complete 10-15-20 stages by guessing the next cards and accumulating winnings.</p>
        <ul>
          <li>Choose your <strong>starting bet</strong> (€0.10–€5) and difficulty (Easy, Medium, Hard).</li>
          <li>Each turn draws a card and gives a challenge: Higher/Lower, Color, Suit, Even/Odd, Range, or Exact Number (Hard only).</li>
          <li>After 3 correct answers in a row, earn a <strong>Joker</strong> or a <strong>Bonus Multiplier</strong>.</li>
          <li>You can withdraw winnings anytime or continue until the last stage.</li>
          <li>Maximum mistakes allowed: Easy/Medium = 4, Hard = 3. Without Jokers, the game ends.</li>
        </ul>`,
      withdrawn: "You withdrew! You earned {points} points.",
      withdraw: "WITHDRAW"
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
    const moltiplicatoriLivello = moltiplicatori[currentLevel];
  for (let i = 0; i < corretti && i < moltiplicatoriLivello.length; i++) {
    guadagno *=  moltiplicatoriLivello[i];
  }
   guadagno += moltiplicatoreBonus * puntataIniziale; 
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
const gameArea = document.getElementById("gameArea");
gameArea.style.transform = "scale(0.90)"; 
gameArea.style.transformOrigin = "top center";
});
