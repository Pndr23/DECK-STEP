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
let currentChallengeType = ""; 
let aCurrent = 0;             
let bCurrent = 0;
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
const soundMinigame = new Audio('minigame.mp3');
const soundJolly = new Audio('jolly.mp3');
const soundMultiplier = new Audio('multiplier.mp3');
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
let audioOn = localStorage.getItem("audioOn") !== "false";
// Sblocca i suoni e la musica al primo click/tap (necessario per policy browser)
function unlockAudio() {
const sounds = [
soundWithdraw, soundWin, soundLose,
soundCorrect, soundWrong, soundFlip,
soundMinigame, soundJolly, soundMultiplier
];
// Precarica i suoni normali
sounds.forEach(snd => {
snd.play().then(() => {
snd.pause();
snd.currentTime = 0;
}).catch(() => {});
});
// Rimuove i listener dopo il primo sblocco
document.removeEventListener("click", unlockAudio);
document.removeEventListener("touchstart", unlockAudio);
}
document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);
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
// Riproduce un effetto sonoro se l'audio è attivo
function playSound(sound) {
if (audioOn) {
sound.currentTime = 0;
sound.play();
}
}
//bottoni per cronologia  e mutare i suoni
window.addEventListener("DOMContentLoaded", () => {
const soundToggle = document.getElementById("soundToggle");
if (!soundToggle) return;
soundToggle.textContent = audioOn ? "🔊" : "🔇";
soundToggle.addEventListener("click", (event) => {
event.stopPropagation();
audioOn = !audioOn;
soundToggle.textContent = audioOn ? "🔊" : "🔇";
localStorage.setItem("audioOn", audioOn);
if (!audioOn) {
backgroundMusic.pause();
} else {
backgroundMusic.play().catch(() => {});
}
});
});
function preloadCardImages() {
const suits = ["C", "P", "F", "Q"]; // semi
for (let i = 1; i <= 10; i++) {     // valori 1-10
suits.forEach(suit => {
const img = new Image();
img.src = `cards/card_${i}${suit}.png`;
});
}
// Jolly
const jolly = new Image();
jolly.src = "jolly.png";
// Dorso
const back = new Image();
back.src = "cards/card_back.png";
}
window.addEventListener("DOMContentLoaded", () => {
preloadCardImages();
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
// Salva la cronologia nel localStorage
function saveHistory(list) {
localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
// Avvia una nuova sessione di cronologia
function startHistorySession() {
playSound(soundClick);
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
// Registra un evento nella cronologia
function logHistoryEvent(eventText) {
if (!activeSession) return;
const list = loadHistory();
const s = list.find(x => x.id === activeSession.id);
if (!s) return;
s.events.push({ at: new Date().toISOString(), text: eventText });
saveHistory(list);
renderHistory();
}
// Conclude e salva l'esito della sessione
function finalizeHistorySession(outcome, winnings = 0) {
if (!activeSession) return;
const list = loadHistory();
const s = list.find(x => x.id === activeSession.id);
if (!s) return;
s.outcome = outcome;
s.winnings = winnings;
s.endedAt = new Date().toISOString();
if (outcome === "Ritirato") {
s.events.push({
at: new Date().toISOString(),
text: `Hai deciso di ritirarti con €${winnings}`
});
}
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
if (openBtn) openBtn.addEventListener('click', () => {
panel.classList.remove('hidden');
renderHistory();
playSound(soundClick); // 🔊 Suono solo quando apri
});
if (closeBtn) closeBtn.addEventListener('click', () => {
panel.classList.add('hidden');
playSound(soundClick); // 🔊 Suono solo quando chiudi
});
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
document.addEventListener('DOMContentLoaded', () => {
initHistoryUI();
renderHistory();
});
//puntata
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
// Mostra il minigioco Jolly e gestisce la scelta
function showMinigiocoJolly(callback) {
    playSound(soundMinigame);
    if (minigiocoAttivo) return;
    minigiocoAttivo = true;
    minigiocoCallback = callback;
    
    const popup = document.getElementById("minigiocoJolly");
    const messaggioEl = document.getElementById("minigiocoMessage"); //

    const miniTitle = popup.querySelector("h2");
    if (miniTitle) miniTitle.textContent = translate("miniTitle");
    // PULISCE IL MESSAGGIO VECCHIO ALL'APERTURA
    if (messaggioEl) messaggioEl.textContent = "";

    if (gameAreaOriginalDisplay === null) {
        gameAreaOriginalDisplay = getComputedStyle(gameArea).display;
    }

    gameArea.style.display = "none";
    popup.classList.add("attivo");

    const cardElems = [
        document.getElementById("minicard1"),
        document.getElementById("minicard2")
    ];

    const jollyImgSrc = "jolly.png";
    const moltiplicatoreScelto = Math.floor(Math.random() * 10) + 1;
    const suitsLetters = ["C", "P", "F", "Q"];
    const suitLetter = suitsLetters[Math.floor(Math.random() * suitsLetters.length)];
    const moltiplicatoreImgSrc = `cards/card_${moltiplicatoreScelto}${suitLetter}.png`;
    
    let carte = [
        { type: "jolly", img: jollyImgSrc },
        { type: "moltiplicatore", img: moltiplicatoreImgSrc, value: moltiplicatoreScelto }
    ];
    carte.sort(() => Math.random() - 0.5);

    cardElems.forEach((el, i) => {
        el.src = "cards/card_back.png";
        el.classList.remove("flipped", "selected", "card-flip");
        el.classList.add("covered");
        el.style.cursor = "pointer";
        el.dataset.type = carte[i].type;
        el.dataset.img = carte[i].img;
        if (carte[i].type === "moltiplicatore") el.dataset.value = carte[i].value;

        el.onclick = () => {
            if (!minigiocoAttivo) return;
            minigiocoAttivo = false;
            cardElems.forEach(c => c.classList.remove("covered"));
            el.classList.add("card-flip");
            
            setTimeout(() => {
                el.src = el.dataset.img;
                el.classList.add("selected");

                // --- MODIFICA QUI PER FAR APPARIRE LA SCRITTA ---
                if (el.dataset.type === "jolly") {
                    playSound(soundJolly);
                    jollyCount++;
                    updateJollyDisplay();
                    updateScore();
                    // Invece di chiamare funzioni esterne, scriviamo direttamente qui:
                   if (messaggioEl) messaggioEl.textContent = translate("miniJollyWin");
            } else if (el.dataset.type === "moltiplicatore") {
                playSound(soundMultiplier);
                const val = el.dataset.value;
                updateScore();
                // USA TRANSLATE E REPLACE QUI:
                if (messaggioEl) {
                    let msg = translate("miniMultWin");
                    messaggioEl.textContent = msg.replace("{val}", val);
                }
                }           
            }, 300);

            el.addEventListener("animationend", () => {
                el.classList.remove("card-flip");
            }, { once: true });

            setTimeout(() => {
                if (minigiocoCallback) minigiocoCallback(el.dataset.type, parseInt(el.dataset.value || "0"));
                minigiocoCallback = null;
                popup.classList.remove("attivo");
                gameArea.style.display = gameAreaOriginalDisplay;
            }, 2000); // Leggermente più tempo per leggere la scritta
        };
    });
    
    const closeBtn = document.getElementById("minigiocoCloseBtn");
    closeBtn.onclick = () => {
        if (!minigiocoAttivo) return;
        minigiocoAttivo = false;
        minigiocoCallback = null;
        popup.classList.remove("attivo");
        gameArea.style.display = gameAreaOriginalDisplay;
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
playSound(soundClick);
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
playSound(soundClick);
});
rulesToggle.addEventListener("click", () => {
rulesPanel.classList.toggle("hidden");
});
startButton.addEventListener("click", () => {
playSound(soundClick);

if (audioOn) {
backgroundMusic.currentTime = 0;   // ricomincia dall'inizio se serve
backgroundMusic.play()
.then(() => console.log("Musica partita"))
.catch(err => console.warn("Errore avvio musica:", err));
}

startHistorySession();
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
updateJollyDisplay();
}
});
languageSelect.addEventListener("change", () => {
currentLanguage = languageSelect.value;
updateLanguage();
playSound(soundClick);
});
withdrawBtn.addEventListener("click", () => {
playSound(soundWithdraw);
const totale = calcolaGuadagno(correctCount);
document.getElementById("gameArea").style.display = "none";
gameSetup.classList.add("hidden");
document.body.style.background = "#800000";
logHistoryEvent(`Hai deciso di ritirarti con €${totale.toFixed(2)}`);
finalizeHistorySession("Ritirato", totale);
// Overlay fullscreen bordeaux
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100vw";
overlay.style.height = "100vh";
overlay.style.background = "#800000"; // bordeaux
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "9999";

// Container grande come il gioco principale
const container = document.createElement("div");
container.style.width = "90%";
container.style.height = "90%";
container.style.padding = "20px";
container.style.borderRadius = "15px";
container.style.backgroundImage = "url('sfondofine.jpg')";
container.style.backgroundSize = "cover";
container.style.backgroundPosition = "center";
if (window.innerWidth <= 768) {
container.style.backgroundSize = "contain";
}
container.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.textAlign = "center";

// Testo ritirata
const text = document.createElement("h1");
text.textContent = translate("withdrawTitle").toUpperCase(); // Forza MAIUSCOLO
text.style.fontSize = "5rem";            // Testo grande
text.style.color = "#DAA520";             // Oro Ocra
text.style.display = "inline-block";
text.style.animation = "ondaOcre 2s ease-in-out infinite"; // Attiva l'onda del CSS
text.style.marginBottom = "20px";
text.style.fontWeight = "900";
text.style.textShadow = "3px 3px 10px rgba(0,0,0,0.5)";

// Mostra vincita
const winnings = document.createElement("p");
const msg = translate("withdrawMsg") || "Hai incassato: €{amount}";
winnings.textContent = msg.replace("{amount}", totale.toFixed(2));
winnings.style.fontSize = "1.5rem";
winnings.style.color = "white";
winnings.style.marginBottom = "25px";

// Bottone Ricomincia
const restartBtn = document.createElement("button");restartBtn.textContent = "🔁 Ricomincia";
restartBtn.textContent = translate("restart") || "🔁 Ricomincia";
restartBtn.style.fontSize = "1.5rem";
restartBtn.style.padding = "10px 20px";
restartBtn.style.background = "#28a745";
restartBtn.style.color = "white";
restartBtn.style.border = "none";
restartBtn.style.borderRadius = "10px";
restartBtn.style.cursor = "pointer";
restartBtn.onclick = () => {
playSound(soundClick);
location.reload();
};
// Appendi elementi
container.appendChild(text);
container.appendChild(winnings);
container.appendChild(restartBtn);
overlay.appendChild(container);
document.body.appendChild(overlay);
});
// Resetta il gioco alla condizione iniziale
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
correctCountSpan.textContent = correctCount;
errorCountSpan.textContent = errorCount;
jollyCountSpan.textContent = jollyCount;
}
//tappe
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
//tappe colorazione
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
//bottone jolly
function updateJollyButton() {
useJollyBtn.classList.toggle("hidden", jollyCount === 0);
}
// Avvia una nuova partita
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
currentChallengeType = selected.key;
const label = selected.label[currentLanguage];
challengeText.textContent = `${translate("challenge")}: ${label}`;
challengeButtons.innerHTML = "";
const lockedValue = currentCard.value;
const lockedSuit = currentCard.suit;
if (selected.key === "higherLower") {
addButton(translate("higher"), (next) => next.value > lockedValue, "higher");
addButton(translate("lower"), (next) => next.value < lockedValue, "lower");
} else if (selected.key === "evenOdd") {
addButton(translate("even"), (next) => next.value % 2 === 0, "even");
addButton(translate("odd"), (next) => next.value % 2 !== 0, "odd");
} else if (selected.key === "inOut") {
const a = Math.floor(Math.random() * 7) + 2;
const b = a + 2; 
    aCurrent = a;
    bCurrent = b;
challengeText.textContent += ` (${a}-${b})`;
addButton(translate("in"), (next) => next.value >= a && next.value <= b, "in");
addButton(translate("out"), (next) => next.value < a || next.value > b, "out");
} else if (selected.key === "exactNumber") {
for (let i = 1; i <= 10; i++) {
addButton(i.toString(), (next) => next.value === i, i.toString());
}
} else if (selected.key === "color") {
addButton(translate("red"), (next) => next.suit === "C" || next.suit === "Q", "red");
addButton(translate("black"), (next) => next.suit === "F" || next.suit === "P", "black");
} else if (selected.key === "suit") {
addButton(translate("hearts"), (next) => next.suit === "C", "hearts");
addButton(translate("diamonds"), (next) => next.suit === "Q", "diamonds");
addButton(translate("clubs"), (next) => next.suit === "F", "clubs");
addButton(translate("spades"), (next) => next.suit === "P", "spades");
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
document.getElementById("gameArea").style.display = "none";
gameSetup.classList.add("hidden");
document.body.style.background = "#800000";
// Overlay fullscreen bordeaux
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100vw";
overlay.style.height = "100vh";
overlay.style.background = "#800000"; // bordeaux
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "99999";
// Container grande come il gioco principale
const container = document.createElement("div");
container.style.width = "90%";
container.style.height = "90%";
container.style.padding = "20px";
container.style.borderRadius = "15px";
container.style.backgroundImage = "url('sfondofine.jpg')"; // la tua immagine
container.style.backgroundSize = "cover";
container.style.backgroundPosition = "center";
if (window.innerWidth <= 768) {
container.style.backgroundSize = "contain";
}
container.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.textAlign = "center";
// Testo Game Over
const text = document.createElement("h1");
text.textContent = translate("lost").toUpperCase(); 
text.style.fontSize = "6rem";        
text.style.color = "#a30000";         
text.style.position = "relative";    
text.style.display = "inline-block";
text.style.marginBottom = "30px";
text.style.fontWeight = "900";
text.style.textShadow = `
    2px 2px 0px #000, 
    4px 4px 0px rgba(0,0,0,0.8), 
    0 0 20px rgba(255,0,0,0.5)
`;
text.style.fontFamily = "'Arial Black', Gadget, sans-serif";
// --- 💧 LACRIME: PIOGGIA SU TUTTO LO SCHERMO ---
for (let i = 0; i < 40; i++) { 
    const drop = document.createElement("div");
    drop.className = "lacrima-animata"; 
    // Posizione orizzontale su tutta la larghezza (vw = view width)
    drop.style.left = Math.random() * 100 + "vw";
    // Ritardo e velocità casuali per l'effetto pioggia
    drop.style.animationDelay = Math.random() * 5 + "s";
    drop.style.animationDuration = (Math.random() * 2 + 2) + "s";
    document.body.appendChild(drop);
    // Pulizia
    setTimeout(() => drop.remove(), 7000);
}
// Bottone Ricomincia
const restartBtn = document.createElement("button");
restartBtn.textContent = translate("restart") || "🔁 Ricomincia";
restartBtn.style.fontSize = "1.5rem";
restartBtn.style.padding = "10px 20px";
restartBtn.style.background = "#28a745";
restartBtn.style.color = "white";
restartBtn.style.border = "none";
restartBtn.style.borderRadius = "10px";
restartBtn.style.cursor = "pointer";
restartBtn.onclick = () => {
playSound(soundClick);
location.reload();
};

// Appendi elementi
container.appendChild(text);
container.appendChild(restartBtn);
overlay.appendChild(container);
document.body.appendChild(overlay);
}

// Aggiunge un bottone con la logica associata (es. Maggiore/Minore)
function addButton(text, checkFn, type) {
const btn = document.createElement("button");
btn.textContent = text;
if (type) {
 btn.dataset.type = type;
}
btn.classList.add("green-button");
btn.style.color = "white";
btn.onclick = () => {
console.log("clicked", text);
const drawnCard = drawCard(currentCard.value);
const cardName = `${drawnCard.value}${drawnCard.suit}`;
logHistoryEvent(`Hai giocato la carta: ${cardName}`);
const drawnImg = document.getElementById("drawnCardImg");
const maxErrors = currentLevel === "hard" ? 3 : 4;
playSound(soundFlip);
drawnImg.classList.add("card-flip");
setTimeout(() => {
displayDrawnCard(drawnCard, false);
}, 400);
setTimeout(() => {
drawnImg.classList.remove("card-flip");
setTimeout(() => {
currentCard = drawnCard;
displayCurrentCard(currentCard);
displayDrawnCard(null, true);
const result = checkFn(drawnCard);
if (result) {
correctCount++;
correctStreak++;
updateScore();
playSound(soundCorrect);
if (tappe === tappeMassime[currentLevel]) {
gameEnded = true;
const totale = calcolaGuadagno(correctCount);
finalizeHistorySession("Vinto", totale);
showVictoryScreen(totale);
} else {
tappe++;
if (correctStreak === 3) {
correctStreak = 0;
showMinigiocoJolly();
}
}

} else {
correctStreak = 0;
errorCount++;
tryAutoJolly(maxErrors);
if (errorCount < maxErrors) {
playSound(soundWrong);
}
if (errorCount >= maxErrors) {
gameEnded = true;
challengeText.textContent = translate("lost");
challengeButtons.innerHTML = "";
restartBtn.classList.remove("hidden");
withdrawBtn.classList.add("hidden");
finalizeHistorySession("Perso", 0);
showGameOverScreen();
}
}
if (!gameEnded) {
generateChallenge();
}
updateScore();
updateProgress();
updateJollyButton();
aggiornaGuadagno(correctCount);
}, 1000);
}, 800);
};
challengeButtons.appendChild(btn);
}
//Schermata vittoria
function showVictoryScreen(vincitaTotale) {
    soundWin.play();
    document.getElementById("gameArea").style.display = "none";
    gameSetup.classList.add("hidden");
    document.body.style.background = "#800000";

    const overlay = document.createElement("div");
    overlay.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:#800000; display:flex; justify-content:center; align-items:center; z-index:9999;";

    const container = document.createElement("div");
    container.style = "width:90%; height:90%; padding:20px; border-radius:15px; background-image:url('sfondofine.jpg'); background-size:cover; background-position:center; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; box-shadow: 0 0 20px rgba(0,0,0,0.5);";
    
    if (window.innerWidth <= 768) { container.style.backgroundSize = "contain"; }

    // --- 👑 CORONA ONDEGGIANTE ---
    const corona = document.createElement("img");
    corona.src = "corona_gold.png";    
    corona.className = "corona-reale"; // Gestita dal CSS per dimensione e onda
    corona.alt = "👑";

// --- 🏆 TITOLO VITTORIA PULITO ---
const title = document.createElement("h1");
let titleText = translate("victoryTitle").replace(/🎆/g, '').trim();
title.textContent = titleText.toUpperCase();

title.style.fontSize = "6rem"; 
title.style.color = "#FFFDD0";        // Colore Crema
title.style.fontWeight = "700";       
title.style.fontFamily = "sans-serif";
title.style.marginBottom = "25px";
title.style.display = "inline-block";
title.style.position = "relative";
title.style.animation = "baglioreDivino 3s ease-in-out infinite, ondaOcre 2s ease-in-out infinite alternate";
title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.3)";

if (window.innerWidth <= 768) { title.style.fontSize = "3.5rem"; }
    // Testo vincita
    const prize = document.createElement("p");
    const winText = translate("victoryWin") || "Hai vinto {amount} crediti!";
    prize.textContent = winText.replace("{amount}", vincitaTotale);
    prize.style.fontSize = "2rem"; // Leggermente più grande per enfasi
    prize.style.color = "white";
    prize.style.fontWeight = "bold";
    prize.style.marginBottom = "25px";
    prize.style.textShadow = "2px 2px 5px black";

    // Bottone Ricomincia
    const restartBtn = document.createElement("button");
    restartBtn.textContent = translate("restart") || "🔁 Ricomincia";
    restartBtn.style = "font-size:1.5rem; padding:10px 20px; background:#28a745; color:white; border:none; border-radius:10px; cursor:pointer;";
    restartBtn.onclick = () => { playSound(soundClick); location.reload(); };

    // Appendi in ordine: Corona -> Titolo -> Premio -> Bottone
    container.appendChild(corona);
    container.appendChild(title);
    container.appendChild(prize);
    container.appendChild(restartBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Effetto brillantini (il tuo codice originale)
    for (let i = 0; i < 30; i++) {
        const spark = document.createElement("div");
        spark.style.position = "fixed";
        spark.style.width = "6px";
        spark.style.height = "6px";
        spark.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
        spark.style.borderRadius = "50%";
        spark.style.top = (Math.random() * window.innerHeight) + "px";
        spark.style.left = (Math.random() * window.innerWidth) + "px";
        spark.style.opacity = "0.8";
        spark.style.transform = "scale(0)";
        spark.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.style.transform = "scale(5)";
            spark.style.opacity = "0";
        }, 50 + i * 100);
        setTimeout(() => spark.remove(), 2000);
    }
}
function tryAutoJolly(maxErrors) {
if (jollyFromMinigioco) {
jollyFromMinigioco = false;
return;
}
if (jollyCount > 0 && errorCount >= maxErrors) {
jollyCount--;
errorCount--;
updateJollyDisplay();
alert("Jolly usato automaticamente!");
updateScore();
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
    const gameTitle = document.getElementById("gameTitle");
    if (gameTitle) gameTitle.textContent = translate("title");
    const startButton = document.getElementById("startButton");
    if (startButton) startButton.textContent = translate("start");
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) restartBtn.textContent = translate("restart");
    const rulesLabel = document.getElementById("rulesLabel");
    if (rulesLabel) rulesLabel.textContent = translate("rules");
    const currentCardLabel = document.getElementById("currentCardLabel");
    if (currentCardLabel) currentCardLabel.textContent = translate("currentCard");
    const betLabel = document.getElementById("betLabel");
    if (betLabel) betLabel.textContent = translate("bet");
    const riskLabel = document.getElementById("riskLabel");
    if (riskLabel) riskLabel.textContent = translate("risk");

    const riskSelect = document.getElementById("risk");
    if (riskSelect) {
        for (const option of riskSelect.options) {
            if (option.value === "easy") option.text = translate("easy");
            else if (option.value === "medium") option.text = translate("medium");
            else if (option.value === "hard") option.text = translate("hard");
        }
    }

    const pointsLabel = document.getElementById("pointsLabel");
    if (pointsLabel) pointsLabel.textContent = translate("points");
    const correctLabel = document.getElementById("correctLabel");
    if (correctLabel) correctLabel.textContent = "✅ " + translate("correct");
    const errorLabel = document.getElementById("errorLabel");
    if (errorLabel) errorLabel.textContent = "❌ " + translate("error");
    const jollyLabel = document.getElementById("jollyLabel");
    if (jollyLabel) jollyLabel.textContent = "🃏 " + translate("jolly");
    if (useJollyBtn) useJollyBtn.textContent = "🃏 " + translate("useJolly");

    updateProgress();
    if (rulesPanel) rulesPanel.innerHTML = translate("rulesText");
    const withdrawLabel = document.getElementById("withdrawLabel");
    if (withdrawLabel) withdrawLabel.textContent = translate("withdraw");
    const drawnCardLabel = document.getElementById("drawnCardLabel");
    if (drawnCardLabel) drawnCardLabel.textContent = translate("drawnCard");

    const betBadge = document.getElementById("betBadge");
    if (betBadge) {
        const betValue = parseFloat(document.getElementById("bet").value).toFixed(2);
        betBadge.textContent = `${translate("bet")} €${betValue}`;
}
if (challengeElement && currentChallengeType) {
let testoSfida = translate(currentChallengeType);
if (currentChallengeType === "inOut" && typeof aCurrent !== 'undefined') {
testoSfida += ` (${aCurrent}-${bCurrent})`;
}
challengeElement.textContent = translate("challenge") + ": " + testoSfida;
}
    const buttons = document.querySelectorAll("#challengeButtons button");
    buttons.forEach(btn => {
        if (btn.dataset.type) {
            btn.textContent = translate(btn.dataset.type);
        }
    });
    // --- TRADUZIONE MINIGIOCO ---
    const miniTitle = document.querySelector("#minigiocoJolly h2");
    if (miniTitle) {
        miniTitle.textContent = translate("miniTitle");
    }

    const miniCloseBtn = document.getElementById("minigiocoCloseBtn");
    if (miniCloseBtn) {
        miniCloseBtn.textContent = translate("miniCancel");
    }

    const miniMsg = document.getElementById("minigiocoMessage");
    if (miniMsg && miniMsg.textContent !== "") {
        if (miniMsg.textContent.includes("Jolly") || miniMsg.textContent.includes("Joker")) {
            miniMsg.textContent = translate("miniJollyWin");
        } else if (miniMsg.textContent.includes("moltiplicatore") || miniMsg.textContent.includes("multiplier")) {
            const valMatch = miniMsg.textContent.match(/\d+/); 
            const val = valMatch ? valMatch[0] : "1";
            let msg = translate("miniMultWin");
            miniMsg.textContent = msg.replace("{val}", val);
        }
    }
} 
//Traduzione per cambio lingua
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
betBadge: "Puntata:",        
currentCard: "Carta attuale:",
drawnCard: "Carta pescata:",
challenge: "Sfida",
higher: "Maggiore",
lower: "Minore",
even: "Pari",
odd: "Dispari",
in: "Dentro",
out: "Fuori",
higherLower: "Maggiore o Minore",
evenOdd: "Pari o Dispari",
inOut: "Dentro o Fuori",
exactNumber: "Numero Esatto",
color: "Colore",
suit: "Seme",
correct: "Corrette",
error: "Errori",
jolly: "Jolly",
useJolly: "Usa Jolly",
stage: "Tappa",
bet: "Puntata:",
risk: "Modalità rischio:",
easy: "Facile",
medium: "Medio",
hard: "Difficile",
lost: "Hai perso!",
victoryTitle: "🎆 VITTORIA! 🎆",
victoryWin: "Hai vinto {amount} crediti!",
withdrawTitle: "💰 RITIRO!",
withdrawMsg: "Hai incassato: €{amount}",
gameOverTitle: "💀 GAME OVER",
gameOverMsg: "Meglio fortuna la prossima volta!",
miniTitle: "Scegli una carta",
miniJollyWin: "Hai vinto 1 Jolly!",
miniMultWin: "Moltiplicatore x{val}!",
miniCancel: "Annulla",
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
betBadge: "Bet:",            
currentCard: "Current card:",
drawnCard: "Drawn card:",    
challenge: "Challenge",
higher: "Higher",
lower: "Lower",
even: "Even",
odd: "Odd",
in: "In",
out: "Out",
higherLower: "Higher or Lower",
evenOdd: "Even or Odd",
inOut: "In or Out",
exactNumber: "Exact Number",
color: "Color",
suit: "Suit",
correct: "Correct",
error: "Errors",
jolly: "Joker",
useJolly: "Use Joker",
stage: "Stage",
bet: "Bet:",
risk: "Risk mode:",
easy: "Easy",
medium: "Medium",
hard: "Hard",
lost: "You lost!",
victoryTitle: "🎆 VICTORY! 🎆",
victoryWin: "You won {amount} credits!",  
withdrawTitle: "💰 WITHDRAW!",
withdrawMsg: "You cashed out: €{amount}",
gameOverTitle: "💀 GAME OVER",
gameOverMsg: "Better luck next time!",
miniTitle: "Pick a card",
miniJollyWin: "You won 1 Joker!",
miniMultWin: "Multiplier x{val}!",
miniCancel: "Cancel",
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
function calcolaGuadagno(corretti) {
let guadagno = puntataIniziale;
const moltiplicatoriLivello = moltiplicatori[currentLevel];
for (let i = 0; i < corretti && i < moltiplicatoriLivello.length; i++) {
guadagno *= moltiplicatoriLivello[i];
}
guadagno += moltiplicatoreBonus * puntataIniziale;
return guadagno;
}
// 🔹 Salva stato musica prima di ricaricare
function saveMusicState() {
if (!backgroundMusic) return;
localStorage.setItem("musicTime", backgroundMusic.currentTime);
localStorage.setItem("musicPlaying", !backgroundMusic.paused);
}
// 🔹 Ripristina musica dopo reload
function restoreMusicState() {
const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
const wasPlaying = localStorage.getItem("musicPlaying") === "true";

if (savedTime > 0) {
backgroundMusic.currentTime = savedTime;
}
if (wasPlaying) {
backgroundMusic.play().catch(() => {});
}
}
  
document.addEventListener("DOMContentLoaded", () => {
currentLanguage = navigator.language.startsWith("en") ? "en" : "it";
languageSelect.value = currentLanguage;
updateLanguage();
aggiornaMoltiplicatori();
  
// 🔹 Ricomincia dopo Game Over
document.getElementById("restartBtn").addEventListener("click", () => {
saveMusicState();
playSound(soundClick);
location.reload();
});
  
// 🔹 Ricomincia dopo Withdraw
document.getElementById("restartBtnWithdraw").addEventListener("click", () => {
saveMusicState();
playSound(soundClick);
location.reload();
});
  
// 🔹 Usa Jolly manualmente
document.getElementById("useJollyBtn").addEventListener("click", () => {
if (jollyCount > 0 && !jollyUsedInThisTurn) {
jollyCount--;
updateJollyDisplay();
jollyUsedInThisTurn = true;
alert("Hai usato il Jolly manualmente!");
}
});
  
// 🔹 Scala grafica area di gioco
const gameArea = document.getElementById("gameArea");
gameArea.style.transform = "scale(0.90)";
gameArea.style.transformOrigin = "top center";
// 🔹 Ripristina musica dopo reload
restoreMusicState();
});
