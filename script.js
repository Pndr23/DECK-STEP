function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
}

function toggleRegolamento() {
  const popup = document.getElementById("regolamento-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function makeGuess(choice) {
  console.log("Hai scelto:", choice);
}

function useJolly() {
  alert("Jolly usato!");
}
