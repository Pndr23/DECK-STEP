const translations = {
  it: {
    bet: "Puntata:",
    riskMode: "Modalità rischio:",
    start: "Inizia la partita",
    currentCard: "Carta attuale:"
  },
  en: {
    bet: "Bet:",
    riskMode: "Risk mode:",
    start: "Start game",
    currentCard: "Current card:"
  }
};

function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  return lang.startsWith("en") ? "en" : "it";
}

function translatePage(lang) {
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userLang = detectLanguage();
  translatePage(userLang);
});