const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const useJollyBtn = document.getElementById("useJollyBtn");
const jollyArea = document.getElementById("jollyArea");

let currentCard = null;
let correctStreak = 0;
let jollyAvailable = false;

startBtn.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startGame();
});

function startGame() {
  currentCard = drawCard();
  displayCard(currentCard);
  generateChallenge();
  correctStreak = 0;
  jollyAvailable = false;
  updateJollyDisplay();
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
    addButton("Maggiore", checkAnswer);
    addButton("Minore", checkAnswer);
  } else if (selectedChallenge === "Pari o Dispari") {
    addButton("Pari", checkAnswer);
    addButton("Dispari", checkAnswer);
  } else if (selectedChallenge === "Dentro o Fuori") {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = a + 2;
    challengeText.textContent += ` (${a}-${b})`;
    challengeButtons.dataset.rangeA = a;
    challengeButtons.dataset.rangeB = b;
    addButton("Dentro", checkAnswer);
    addButton("Fuori", checkAnswer);
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString(), checkAnswer);
    }
  }
}

function addButton(text, handler) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => handler(text);
  challengeButtons.appendChild(btn);
}

function checkAnswer(choice) {
  const newCard = drawCard();
  const prevCard = currentCard;
  currentCard = newCard;
  displayCard(currentCard);

  let correct = false;

  const a = parseInt(challengeButtons.dataset.rangeA);
  const b = parseInt(challengeButtons.dataset.rangeB);

  if (choice === "Maggiore") correct = newCard > prevCard;
  else if (choice === "Minore") correct = newCard < prevCard;
  else if (choice === "Pari") correct = newCard % 2 === 0;
  else if (choice === "Dispari") correct = newCard % 2 !== 0;
  else if (choice === "Dentro") correct = newCard >= a && newCard <= b;
  else if (choice === "Fuori") correct = newCard < a || newCard > b;
  else correct = parseInt(choice) === newCard;

  if (correct) {
    correctStreak++;
    if (correctStreak === 3 && !jollyAvailable) {
      jollyAvailable = true;
      alert("Hai guadagnato un Jolly! 🃏");
    }
  } else {
    if (jollyAvailable) {
      const use = confirm("Hai sbagliato. Vuoi usare il Jolly per annullare l'errore?");
      if (use) {
        jollyAvailable = false;
        updateJollyDisplay();
        return; // Errore annullato
      }
    }
    correctStreak = 0;
    alert("Hai sbagliato!");
  }

  updateJollyDisplay();
  generateChallenge();
}

function updateJollyDisplay() {
  if (jollyAvailable) {
    jollyArea.classList.remove("hidden");
  } else {
    jollyArea.classList.add("hidden");
  }
}

useJollyBtn.addEventListener("click", () => {
  alert("Hai usato il Jolly per saltare questa sfida!");
  jollyAvailable = false;
  updateJollyDisplay();
  generateChallenge();
});
