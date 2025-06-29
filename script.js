document.addEventListener('DOMContentLoaded', () => {
  let currentCard = null;
  let previousCard = null;
  let score = 0;
  let errors = 0;
  let jokers = 3;
  let record = 0;
  let selectedChallenge = '';
  let selectedBet = 1;
  let selectedDifficulty = 'normal';
  let currentStep = 0;
  let lang = 'it';
  let winStreak = 0;
  const cardSuits = ['C', 'D', 'H', 'S'];
  const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const messages = {
    it: {
      correct: 'Corretto!',
      wrong: 'Sbagliato!',
      gameOver: 'Hai perso!',
      noJokers: 'Nessun jolly rimasto!',
      youWin: 'Hai vinto!',
      jackpot: 'JACKPOT!',
      useJolly: 'Usa Jolly',
      rules: 'Regole del gioco:\nScegli una sfida e indovina la carta successiva.\nPuoi usare un jolly per salvarti dagli errori.\nSupera le tappe per aumentare il moltiplicatore!',
    },
    en: {
      correct: 'Correct!',
      wrong: 'Wrong!',
      gameOver: 'Game Over!',
      noJokers: 'No jokers left!',
      youWin: 'You win!',
      jackpot: 'JACKPOT!',
      useJolly: 'Use Joker',
      rules: 'Game Rules:\nChoose a challenge and guess the next card.\nYou can use a joker to avoid mistakes.\nPass checkpoints to increase multiplier!',
    }
  };

  const cardElement = document.getElementById('card');
  const resultElement = document.getElementById('result');
  const scoreElement = document.getElementById('score');
  const errorsElement = document.getElementById('errors');
  const recordElement = document.getElementById('record');
  const jokersElement = document.getElementById('jokers');
  const challengeButtons = document.querySelectorAll('.challenge-button');
  const useJokerButton = document.getElementById('useJoker');
  const restartButton = document.getElementById('restart');
  const betSelect = document.getElementById('bet');
  const difficultySelect = document.getElementById('difficulty');
  const rulesButton = document.getElementById('showRules');
  const rulesModal = document.getElementById('rulesModal');
  const closeRules = document.getElementById('closeRules');
  const languageSelect = document.getElementById('language');
  const steps = document.querySelectorAll('.progress-step');
  const gainLabel = document.getElementById('gainLabel');
  const jackpotLabel = document.getElementById('jackpotLabel');
  const jackpotSound = document.getElementById('jackpotSound');

  function shuffleCard() {
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    const value = cardValues[Math.floor(Math.random() * cardValues.length)];
    return { suit, value };
  }

  function getCardImage(card) {
    return `cards/${card.value}${card.suit}.png`;
  }

  function getCardNumericValue(card) {
    if (card.value === 'A') return 14;
    if (card.value === 'K') return 13;
    if (card.value === 'Q') return 12;
    if (card.value === 'J') return 11;
    return parseInt(card.value);
  }

  function updateCardDisplay(card) {
    cardElement.src = getCardImage(card);
  }

  function getMultiplier(step) {
    const multipliers = [1, 1.5, 2, 3, 5, 10];
    return multipliers[step] || 1;
  }

  function updateGainLabel() {
    const multiplier = getMultiplier(currentStep);
    const gain = (score * selectedBet * multiplier).toFixed(2);
    gainLabel.textContent = `+€${gain}`;
  }

  function showJackpotAnimation() {
    jackpotLabel.classList.remove('hidden', 'shrink');
    jackpotLabel.classList.add('jackpot-animation');
    jackpotSound.play();
    setTimeout(() => {
      jackpotLabel.classList.add('shrink');
    }, 3000);
  }

  function checkChallenge(card1, card2, challenge) {
    const val1 = getCardNumericValue(card1);
    const val2 = getCardNumericValue(card2);
    switch (challenge) {
      case 'higher': return val2 > val1;
      case 'lower': return val2 < val1;
      case 'equal': return val2 === val1;
      case 'odd': return val2 % 2 === 1;
      case 'even': return val2 % 2 === 0;
      case 'inside':
        const min = Math.min(val1, getCardNumericValue(previousCard));
        const max = Math.max(val1, getCardNumericValue(previousCard));
        return val2 > min && val2 < max;
      case 'outside':
        const minOut = Math.min(val1, getCardNumericValue(previousCard));
        const maxOut = Math.max(val1, getCardNumericValue(previousCard));
        return val2 < minOut || val2 > maxOut;
      default: return false;
    }
  }

  function updateProgress() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index <= currentStep);
    });
  }

  function handleCorrect() {
    score++;
    winStreak++;
    if (winStreak % 3 === 0 && currentStep < steps.length - 1) {
      currentStep++;
      updateProgress();
    }
    updateGainLabel();
    resultElement.textContent = messages[lang].correct;
    if (currentStep === steps.length - 1) showJackpotAnimation();
    updateDisplay();
  }

  function handleWrong() {
    resultElement.textContent = messages[lang].wrong;
    if (jokers > 0) {
      jokers--;
      updateDisplay();
    } else {
      endGame();
    }
  }

  function endGame() {
    resultElement.textContent = messages[lang].gameOver;
    if (score > record) {
      record = score;
      recordElement.textContent = record;
    }
    disableChallenges();
  }

  function updateDisplay() {
    scoreElement.textContent = score;
    errorsElement.textContent = errors;
    jokersElement.textContent = jokers;
    updateProgress();
    updateGainLabel();
  }

  function disableChallenges() {
    challengeButtons.forEach(btn => btn.disabled = true);
  }

  function enableChallenges() {
    challengeButtons.forEach(btn => btn.disabled = false);
  }

  function newRound() {
    previousCard = currentCard;
    currentCard = shuffleCard();
    updateCardDisplay(currentCard);
  }

  challengeButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedChallenge = button.dataset.challenge;
      previousCard = currentCard;
      currentCard = shuffleCard();
      updateCardDisplay(currentCard);
      const correct = checkChallenge(previousCard, currentCard, selectedChallenge);
      if (correct) handleCorrect();
      else handleWrong();
    });
  });

  useJokerButton.addEventListener('click', () => {
    if (jokers > 0) {
      jokers--;
      score++;
      winStreak++;
      if (winStreak % 3 === 0 && currentStep < steps.length - 1) {
        currentStep++;
        updateProgress();
      }
      updateDisplay();
    } else {
      resultElement.textContent = messages[lang].noJokers;
    }
  });

  restartButton.addEventListener('click', () => {
    score = 0;
    errors = 0;
    jokers = 3;
    currentStep = 0;
    winStreak = 0;
    currentCard = shuffleCard();
    updateCardDisplay(currentCard);
    updateDisplay();
    enableChallenges();
    resultElement.textContent = '';
    jackpotLabel.classList.add('hidden');
  });

  betSelect.addEventListener('change', () => {
    selectedBet = parseFloat(betSelect.value);
    updateGainLabel();
  });

  difficultySelect.addEventListener('change', () => {
    selectedDifficulty = difficultySelect.value;
  });

  rulesButton.addEventListener('click', () => {
    rulesModal.style.display = 'block';
  });

  closeRules.addEventListener('click', () => {
    rulesModal.style.display = 'none';
  });

  languageSelect.addEventListener('change', () => {
    lang = languageSelect.value;
    useJokerButton.textContent = messages[lang].useJolly;
    rulesButton.textContent = messages[lang].rules.split('\n')[0];
    updateGainLabel();
  });

  // Inizializzazione iniziale
  selectedBet = parseFloat(betSelect.value);
  currentCard = shuffleCard();
  updateCardDisplay(currentCard);
  updateDisplay();
  useJokerButton.textContent = messages[lang].useJolly;
  rulesButton.textContent = messages[lang].rules.split('\n')[0];
});
