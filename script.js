const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const gameSetup = document.getElementById("gameSetup");
const challengeText = document.getElementById("challengeText");
const challengeButtons = document.getElementById("challengeButtons");
const currentCardImg = document.getElementById("currentCardImg");
const rulesSection = document.getElementById("rulesSection");

document.getElementById("languageSelect").addEventListener("change", updateLanguage);

let currentLang = navigator.language.startsWith("en") ? "en" : "it";
document.getElementById("languageSelect").value = currentLang;

function updateLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  const text = translations[currentLang];
  document.getElementById("gameTitle").textContent = text.title;
  document.getElementById("betLabel").textContent = text.bet;
  document.getElementById("riskLabel").textContent = text.risk;
  document.getElementById("startBtn").textContent = text.start;
  document.getElementById("currentCardLabel").textContent = text.currentCard;
  document.getElementById("languageLabel").textContent = text.language;
  rulesSection.innerHTML = `<h2>${text.rulesTitle}</h2><p>${text.rulesText}</p>`;
}

startBtn.addEventListener("click", () => {
  gameSetup.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startGame();
});

let currentCard = null;
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
  const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = translations[currentLang].challenge + ": " + selectedChallenge;
  challengeButtons.innerHTML = "";

  if (selectedChallenge === "Maggiore o Minore") {
    addButton("Maggiore");
    addButton("Minore");
  } else if (selectedChallenge === "Pari o Dispari") {
    addButton("Pari");
    addButton("Dispari");
  } else if (selectedChallenge === "Dentro o Fuori") {
    addButton("Dentro");
    addButton("Fuori");
  } else if (selectedChallenge === "Numero Esatto") {
    for (let i = 1; i <= 10; i++) {
      addButton(i.toString());
    }
  }
}

function addButton(label) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = () => alert(`Hai scelto: ${label}`);
  challengeButtons.appendChild(btn);
}

updateLanguage();
