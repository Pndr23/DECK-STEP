
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");

let currentCard = null;

startBtn.addEventListener("click", () => {
  const bet = document.getElementById("bet").value;
  const risk = document.getElementById("risk").value;

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
  btn.onclick = () => checkAnswer(text);
  challengeButtons.appendChild(btn);
}

function checkAnswer(choice) {
  const nextCard = drawCard();
  displayCard(nextCard);

  let correct = false;
  const type = challengeText.textContent.split(": ")[1].split(" ")[0];

  if (type === "Maggiore") {
    correct = nextCard > currentCard && choice === "Maggiore";
    correct ||= nextCard < currentCard && choice === "Minore";
  } else if (type === "Pari") {
    correct = nextCard % 2 === 0 && choice === "Pari";
    correct ||= nextCard % 2 !== 0 && choice === "Dispari";
  } else if (type === "Dentro") {
    const a = parseInt(challengeButtons.dataset.rangeA);
    const b = parseInt(challengeButtons.dataset.rangeB);
    correct = nextCard > a && nextCard < b && choice === "Dentro";
    correct ||= (nextCard <= a || nextCard >= b) && choice === "Fuori";
  } else if (type === "Numero") {
    correct = nextCard.toString() === choice;
  }

  alert(correct ? "Risposta corretta!" : "Risposta sbagliata!");
  currentCard = nextCard;
  generateChallenge();
}
