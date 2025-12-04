const gameBoard = document.getElementById("gameBoard");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const menuBtn = document.getElementById("menu");
const difficultySelect = document.getElementById("difficulty");
const timeDisplay = document.getElementById("time");
const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let totalPairs = 0;
let score = 10000;
let timer;
let seconds = 0;

const cardImages = [
  "https://www.shutterstock.com/image-vector/vector-cartoon-character-mascot-pencil-260nw-2329184163.jpg",
  "https://i.pinimg.com/1200x/68/7e/18/687e185301d988ddb1f2f9ad6a633b4d.jpg",
  "https://i.pinimg.com/1200x/cc/d8/61/ccd861bf5d1be1fb84d14005981c28ba.jpg",
  "https://i.pinimg.com/736x/a5/fc/0e/a5fc0e2aec0110d1d5dd03af93864b77.jpg",
  "https://i.pinimg.com/736x/d8/7b/79/d87b795309939339bef39f45d9f7c04c.jpg",
  "https://i.pinimg.com/736x/0c/38/4d/0c384d97dab652de71152584079cfa23.jpg",
  "https://i.pinimg.com/236x/a3/06/85/a30685a1ecca0eab71fc92c60786a21c.jpg",
  "https://i.pinimg.com/474x/78/5a/fc/785afce9bab088f9d0dd3c3acfdeedfb.jpg",
  "https://i.pinimg.com/736x/4f/df/2e/4fdf2e2a26c9987db95d840baf1db2ae.jpg",
  "https://i.pinimg.com/222x/5d/07/fa/5d07fa537be3086a5296908bd3583a3f.jpg",
  "https://img.freepik.com/psd-premium/fotografia-primer-plano-coco-maduro_1078562-108.jpg",
  "https://i.pinimg.com/736x/8f/ae/a2/8faea20b903731529b6f2a4287e401d4.jpg",
  "https://i.pinimg.com/1200x/ff/95/7f/ff957f53019f7a1ab996dbbeafb41585.jpg",
  "https://i.pinimg.com/736x/83/6b/b3/836bb3cf1bcb0fa892b458482ad5025b.jpg",
  "https://i.pinimg.com/1200x/23/3b/93/233b938e8752e732ed32932fbdbe6ddb.jpg"
];

function startGame() {
  clearInterval(timer);
  seconds = 0; attempts = 0; matches = 0; score = 10000;
  firstCard = null; secondCard = null; lockBoard = false;

  timeDisplay.textContent = `Tiempo: 0s`;
  attemptsDisplay.textContent = `Intentos: 0`;
  scoreDisplay.textContent = `Puntos: ${score}`;

  const difficulty = difficultySelect.value;
  totalPairs = difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 15;

  const selectedImages = cardImages.slice(0, totalPairs);
  const deck = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(totalPairs * 2))}, auto)`;

  deck.forEach((img) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="front"></div>
      <div class="back"><img src="${img}" alt="carta"></div>
    `;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  timer = setInterval(() => {
    seconds++;
    score = Math.max(0, score - 5);
    timeDisplay.textContent = `Tiempo: ${seconds}s`;
    scoreDisplay.textContent = `Puntos: ${score}`;
  }, 1000);
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  attempts++;
  attemptsDisplay.textContent = `Intentos: ${attempts}`;
  score = Math.max(0, score - 50);
  scoreDisplay.textContent = `Puntos: ${score}`;

  checkForMatch();
}

function checkForMatch() {
  const img1 = firstCard.querySelector(".back img").src;
  const img2 = secondCard.querySelector(".back img").src;

  if (img1 === img2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;

    if (matches === totalPairs) {
      clearInterval(timer);
      setTimeout(() => {
        alert("¡FELICIDADES! ¡Ganaste el juego!");
      }, 800);
    }
    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Eventos
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
menuBtn.addEventListener("click", () => location.href = "../index.html");