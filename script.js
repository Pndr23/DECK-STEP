
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const scoreEl = document.getElementById("score");
const errorsEl = document.getElementById("errors");

let currentCard = null;
let score = 0;
let errors = 0;
let streak = 0;

startBtn.addEventListener("click", () => {
  const bet = document.getElementById("bet").value;
  const risk = document.getElementById("risk").value;

  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  document.getElementById("statusBar").classList.remove("hidden");

  score = 0;
  errors = 0;
  streak = 0;
  updateStatus();

  startGame();
});

function updateStatus() {
  scoreEl.textContent = score;
  errorsEl.textContent = errors;
}

function startGame() {
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
  const randomIndex = Math.floor(Math.random() * challenges.length);
  const selectedChallenge = challenges[randomIndex];

  challengeText.textContent = `Sfida: ${selectedChallenge}`;
  challengeButtons.innerHTML = "";

  if (selectedChallenge === "Maggiore o Minore") {
    addChallengeButton("Maggiore");
    addChallengeButton("Minore");
  } else if (selectedChallenge === "Pari o Dispari") {
    addChallengeButton("Pari");
    addChallengeButton("Dispari");
  } else if (selectedChallenge === "Dentro o Fuori") {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    challengeButtons.dataset.rangeA = a;
    challengeButtons.dataset.rangeB = b;
    addChallengeButton("Dentro");
    addChallengeButton("Fuori");
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 10; i++) {
      addChallengeButton(i.toString());
    }
  }
}

function addChallengeButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    alert(`Hai scelto: ${text}`);
    handleAnswer(true); // test: ogni scelta è corretta
  };
  challengeButtons.appendChild(btn);
}

function handleAnswer(correct) {
  if (correct) {
    score++;
    streak++;
    if (streak === 3) {
      alert("Hai ottenuto un Jolly!");
      streak = 0;
    }
  } else {
    errors++;
    streak = 0;
  }
  updateStatus();
}
