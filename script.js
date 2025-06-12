
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const jollyArea = document.getElementById("jollyArea");
const useJollyBtn = document.getElementById("useJollyBtn");

let currentCard = null;
let jollyAvailable = false;
let correctStreak = 0;

startBtn.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startGame();
});

function startGame() {
  correctStreak = 0;
  jollyAvailable = false;
  updateJollyDisplay();
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
  btn.onclick = () => handleAnswer(text);
  challengeButtons.appendChild(btn);
}

function handleAnswer(choice) {
  const nextCard = drawCard();
  let isCorrect = false;

  const challenge = challengeText.textContent;

  if (challenge.includes("Maggiore o Minore")) {
    isCorrect = (choice === "Maggiore" && nextCard > currentCard) || (choice === "Minore" && nextCard < currentCard);
  } else if (challenge.includes("Pari o Dispari")) {
    isCorrect = (choice === "Pari" && nextCard % 2 === 0) || (choice === "Dispari" && nextCard % 2 !== 0);
  } else if (challenge.includes("Dentro o Fuori")) {
    const a = parseInt(challengeButtons.dataset.rangeA);
    const b = parseInt(challengeButtons.dataset.rangeB);
    isCorrect = (choice === "Dentro" && nextCard > a && nextCard < b) || (choice === "Fuori" && (nextCard < a || nextCard > b));
  } else if (challenge.includes("Numero Esatto")) {
    isCorrect = parseInt(choice) === nextCard;
  }

  if (isCorrect) {
    correctStreak++;
    if (correctStreak === 3) {
      jollyAvailable = true;
      updateJollyDisplay();
    }
    currentCard = nextCard;
    displayCard(currentCard);
    generateChallenge();
  } else if (jollyAvailable) {
    alert("Errore annullato grazie al Jolly!");
    jollyAvailable = false;
    updateJollyDisplay();
    generateChallenge();
  } else {
    alert("Hai sbagliato! Fine gioco.");
    location.reload();
  }
}

useJollyBtn.addEventListener("click", () => {
  if (jollyAvailable) {
    alert("Hai saltato la sfida grazie al Jolly!");
    jollyAvailable = false;
    correctStreak = 0;
    updateJollyDisplay();
    generateChallenge();
  }
});

function updateJollyDisplay() {
  jollyArea.classList.toggle("hidden", !jollyAvailable);
}
