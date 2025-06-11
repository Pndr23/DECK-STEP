
const rulesText = {
  it: `🧾 <strong>1. Descrizione Generale</strong><br/>
Carta Passo è un gioco di carte a tappe in cui il giocatore avanza indovinando caratteristiche della prossima carta. [...]<br/><br/>
🃏 <strong>2. Il Mazzo di Gioco</strong><br/>
Mazzo composto da 40 carte numerate da 1 a 10. [...]<br/><br/>
🎮 <strong>3. Modalità di Gioco</strong><br/>
⚙️ Scelta Iniziale, modalità rischio, tappe, jolly, ecc.<br/><br/>
🔍 <strong>4. Tipologie di Sfide</strong><br/>
Maggiore o Minore, Pari o Dispari, Dentro o Fuori, Numero Esatto, ecc.<br/><br/>
🪜 <strong>5. Struttura a Tappe</strong><br/>
Tabella con moltiplicatori da x1.2 fino a x100 (Jackpot).<br/><br/>
🃏 <strong>6. Carta Jolly</strong><br/>
Dopo 3 tappe corrette, possibilità di annullare un errore.<br/><br/>
💸 <strong>7. Vincita</strong><br/>
Puntata × moltiplicatore.<br/><br/>
⚠️ <strong>8. Fine Partita</strong><br/>
Raggiunta tappa 10, errore, incasso o mazzo esaurito.<br/><br/>
✅ <strong>9. Requisiti ADM</strong><br/>
RNG certificato, interazione semplice, RTP, ecc.`,

  en: `<strong>🧾 1. General Description</strong><br/>
Carta Passo is a multi-stage card game where the player progresses by guessing the next card’s characteristics. [...]<br/><br/>
🃏 <strong>2. The Deck</strong><br/>
40 cards, numbered 1–10, four of each. [...]<br/><br/>
🎮 <strong>3. Game Modes</strong><br/>
Bet selection, risk mode, stage progress, jokers, etc.<br/><br/>
🔍 <strong>4. Challenge Types</strong><br/>
Higher or Lower, Even or Odd, In or Out, Exact Number, etc.<br/><br/>
🪜 <strong>5. Stage Structure</strong><br/>
Multiplier table from x1.2 to x100 (Jackpot).<br/><br/>
🃏 <strong>6. Joker Card</strong><br/>
After 3 correct stages, cancel a mistake once.<br/><br/>
💸 <strong>7. Winnings</strong><br/>
Initial bet × reached multiplier.<br/><br/>
⚠️ <strong>8. Game End</strong><br/>
By reaching stage 10, making a mistake, cashing out, or deck exhaustion.<br/><br/>
✅ <strong>9. ADM Requirements</strong><br/>
Certified RNG, simple interaction, adjustable RTP, etc.`
};

const languageSelector = document.getElementById("language");
const rulesSection = document.getElementById("rulesSection");
const gameTitle = document.getElementById("gameTitle");
const langLabel = document.getElementById("langLabel");
const startBtn = document.getElementById("startBtn");

function updateLanguage(lang) {
  rulesSection.innerHTML = rulesText[lang];
  gameTitle.textContent = lang === "it" ? "Carta Passo" : "Step Card";
  langLabel.textContent = lang === "it" ? "Lingua:" : "Language:";
  startBtn.textContent = lang === "it" ? "Inizia la partita" : "Start Game";
}

languageSelector.addEventListener("change", () => {
  updateLanguage(languageSelector.value);
});

document.addEventListener("DOMContentLoaded", () => {
  updateLanguage(languageSelector.value);
});
