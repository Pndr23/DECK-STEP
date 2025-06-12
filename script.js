const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const jollyArea = document.getElementById("jollyArea");
const useJollyBtn = document.getElementById("useJollyBtn");

let currentCard = null;
let correctStreak = 0;
let hasJolly = false;

startBtn.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startGame();
});

useJollyBtn.addEventListener("click", () => {
  if (hasJolly) {
    alert("Hai usato il Jolly! Sfida saltata.");
    hasJolly = false;
    jollyArea.classList.add("hidden");
    nextRound();
  }
});

function startGame() {
  correctStreak = 0;
  hasJolly = false;
  jollyArea.classList.add("hidden");
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function displayCard(cardNumber) {
  const fileName = `card_${cardNumber}.png`;
  currentCardImg.src = `cards/${fileName}`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];

  challengeText.textContent = `Sfida: ${selectedChallenge}`;
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
  } else {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString());
    }
  }
}

function addButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => handleChoice(text);
  challengeButtons.appendChild(btn);
}

function handleChoice(choice) {
  // Per ora accettiamo qualsiasi scelta come corretta per testare
  correctStreak++;
  if (correctStreak >= 3 && !hasJolly) {
    hasJolly = true;
    jollyArea.classList.remove("hidden");
    alert("Hai guadagnato un Jolly!");
  }
  nextRound();
}

function nextRound() {
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}