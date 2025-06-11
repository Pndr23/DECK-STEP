
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const stepDisplay = document.getElementById("stepDisplay");
const pointsDisplay = document.getElementById("pointsDisplay");
const errorsDisplay = document.getElementById("errorsDisplay");

let currentCard = null;
let step = 0;
let points = 0;
let errors = 0;
let bet = 1;
let risk = "easy";

const multipliers = [1, 1.2, 1.5, 2, 3, 5, 8, 12, 20, 40, 100];

startBtn.addEventListener("click", () => {
  bet = parseFloat(document.getElementById("bet").value);
  risk = document.getElementById("risk").value;

  step = 0;
  points = 0;
  errors = 0;

  updateStatus();

  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");

  startGame();
});

function startGame() {
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function displayCard(cardNumber) {
  currentCardImg.src = `cards/card_${cardNumber}.png`;
}

function generateChallenge() {
  const challenges = ["Maggiore o Minore", "Pari o Dispari", "Dentro o Fuori", "Numero Esatto"];
  const randomIndex = Math.floor(Math.random() * challenges.length);
  const selectedChallenge = challenges[randomIndex];

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
    challengeButtons.dataset.rangeA = a;
    challengeButtons.dataset.rangeB = b;
    addButton("Dentro");
    addButton("Fuori");
  } else if (selectedChallenge === "Numero Esatto") {
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
  const newCard = drawCard();
  const correct = Math.random() < 0.5; // Simulazione
  displayCard(newCard);

  if (correct) {
    step++;
    points = bet * multipliers[step];
  } else {
    errors++;
    if (risk === "easy") step = Math.max(0, step - 2);
    else if (risk === "medium") step = 0;
    else if (risk === "hard") {
      step = 0;
      points = 0;
    }
  }

  updateStatus();
  currentCard = newCard;
  generateChallenge();
}

function updateStatus() {
  stepDisplay.textContent = `Tappa: ${step}`;
  pointsDisplay.textContent = `Punti: €${points.toFixed(2)}`;
  errorsDisplay.textContent = `Errori: ${errors}`;
}
