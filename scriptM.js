const icons = ["🍎", "🚗", "⭐", "🌧️", "👽", "❤️", "🐍", "⚡", "🎮", "💀", "🔥", "🎧", "🚀", "🌙", "🦾"];

let gameBoard = document.getElementById("gameBoard");
let attemptsSpan = document.getElementById("attempts");
let timeSpan = document.getElementById("time");
let scoreSpan = document.getElementById("score");
let difficultySelect = document.getElementById("difficulty");
let startBtn = document.getElementById("start");
let restartBtn = document.getElementById("restart");

let firstCard, secondCard;
let lockBoard = false;
let attempts = 0;
let time = 0;
let score = 10000;
let timerInterval, scoreInterval;
let totalPairs = 0;
let foundPairs = 0;

function generateCards(pairCount) {
  let selectedIcons = icons.slice(0, pairCount);
  let cardValues = [...selectedIcons, ...selectedIcons];
  cardValues.sort(() => 0.5 - Math.random());

  gameBoard.innerHTML = "";
  let columns = Math.ceil(Math.sqrt(pairCount * 2));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, auto)`;

  cardValues.forEach(value => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.innerHTML = "?";
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  totalPairs = pairCount;
  foundPairs = 0;
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

  this.innerHTML = this.dataset.value;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  attempts++;
  score -= 50;
  attemptsSpan.textContent = `🎯 Intentos: ${attempts}`;
  scoreSpan.textContent = `💎 Puntos: ${score}`;

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    foundPairs++;

    resetBoard();

    // 🛑 Si ya encontró todos los pares, detener contadores
    if (foundPairs === totalPairs) {
      clearInterval(timerInterval);
      clearInterval(scoreInterval);
    }
  } else {
    setTimeout(() => {
      firstCard.innerHTML = "?";
      secondCard.innerHTML = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startGame() {
  clearInterval(timerInterval);
  clearInterval(scoreInterval);

  attempts = 0;
  time = 0;
  score = 10000;
  attemptsSpan.textContent = `🎯 Intentos: 0`;
  timeSpan.textContent = `⏱ Tiempo: 0s`;
  scoreSpan.textContent = `💎 Puntos: ${score}`;

  let difficulty = difficultySelect.value;
  let pairCount = difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 15;

  generateCards(pairCount);

  timerInterval = setInterval(() => {
    time++;
    timeSpan.textContent = `⏱ Tiempo: ${time}s`;
  }, 1000);

  scoreInterval = setInterval(() => {
    score -= 5;
    scoreSpan.textContent = `💎 Puntos: ${score}`;
  }, 1000);
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
