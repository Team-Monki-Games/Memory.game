const allIcons = [
  "🍎","🚗","⭐","🌧️","👽","❤️",
  "🐶","🐱","🎲","🎵","⚽","🏀",
  "🎮","🍕","🍔","🍩","🦄","🐉",
  "🚀","🌙"
];

let deck = [];
let firstCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let interval = null;
let pairsToMatch = 0;
let matchedPairs = 0;
let score = 10000;

function startGame(numPairs) {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  deck = [];
  firstCard = null;
  lockBoard = false;
  moves = 0;
  timer = 0;
  matchedPairs = 0;
  pairsToMatch = numPairs;
  score = 10000;
  updateHUD();
  clearInterval(interval);
  interval = null;

  let selectedIcons = allIcons.sort(() => Math.random() - 0.5).slice(0, numPairs);
  deck = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);

  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  let columns = Math.ceil(Math.sqrt(numPairs * 2));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;

  deck.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="front">${icon}</div>
      <div class="back">❓</div>
    `;
    card.dataset.icon = icon;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    startTimer();
    return;
  }

  moves++;
  score -= 50;
  if (score < 0) score = 0;
  updateHUD();

  if (firstCard.dataset.icon === this.dataset.icon) {
    firstCard.classList.add("matched");
    this.classList.add("matched");

    firstCard.dataset.icon = firstCard.dataset.icon;
    this.dataset.icon = this.dataset.icon;

    firstCard = null;
    matchedPairs++;

    showPairFound(this.dataset.icon);

    if (matchedPairs === pairsToMatch) {
      clearInterval(interval);
      setTimeout(() => {
        alert(`🎉 ¡Ganaste en ${moves} intentos, ${timer} segundos y con ${score} puntos!`);
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      this.classList.remove("flipped");
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    timer++;
    score -= 5;
    if (score < 0) score = 0;
    updateHUD();
  }, 1000);
}

function updateHUD() {
  document.getElementById("moves").textContent = moves;
  document.getElementById("timer").textContent = timer;
  document.getElementById("score").textContent = score;
}

function restartGame() {
  clearInterval(interval);
  interval = null;
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("game-container").classList.add("hidden");
}

function showPairFound(icon) {
  const msg = document.createElement("div");
  msg.textContent = `Par encontrado: ${icon}`;
  msg.style.position = "fixed";
  msg.style.top = "10%";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.padding = "10px 20px";
  msg.style.background = "rgba(255,255,0,0.9)";
  msg.style.color = "#000";
  msg.style.fontSize = "1.5rem";
  msg.style.borderRadius = "10px";
  msg.style.boxShadow = "0 0 10px #ff0";
  msg.style.zIndex = "1000";
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 1500);
}
