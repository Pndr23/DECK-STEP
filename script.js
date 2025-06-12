const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");

const stepSpan = document.getElementById("step");
const multiplierSpan = document.getElementById("multiplier");
const potentialWinSpan = document.getElementById("potentialWin");
const cashOutBtn = document.getElementById("cashOutBtn");

let currentCard = null;
let step = 1;
let betAmount = 1;
let multipliers = [1.2, 1.5, 2, 3, 5, 8, 12, 20, 40, 100];

startBtn.addEventListener("click", () => {
  betAmount = parseFloat(document.getElementById("bet").value);
  const risk = document.getElementById("risk").value;

  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");

  startGame();
});

cashOutBtn.addEventListener("click", () => {
  const win = (betAmount * multipliers[step - 1]).toFixed(2);
  alert(`Hai incassato: €${win}`);
  location.reload();
});

function startGame() {
  step = 1;
  updateStepDisplay();
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
}

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function displayCard(cardNumber) {
  const fileName = cardNumber <= 10 ? `card_${cardNumber}.png` : `card_10.png`;
  currentCardImg.src = `cards/${fileName}`;
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
  btn.onclick = () => {
    alert(`Hai scelto: ${text}`);
    step++;
    if (step > 10) {
      alert("🎉 Hai raggiunto la tappa 10! Jackpot vinto!");
    } else {
      updateStepDisplay();
      currentCard = drawCard();
      displayCard(currentCard);
      generateChallenge();
    }
  };
  challengeButtons.appendChild(btn);
}

function updateStepDisplay() {
  stepSpan.textContent = step;
  multiplierSpan.textContent = multipliers[step - 1];
  potentialWinSpan.textContent = (betAmount * multipliers[step - 1]).toFixed(2);
}
