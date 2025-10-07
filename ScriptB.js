const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;

// Paletas de colores neón para cada regeneración
const neonPalettes = [
  ["#ff00ff", "#ff1493", "#ff4500", "#ffa500"], // rosa → naranja
  ["#00ffff", "#00ced1", "#00bfff", "#1e90ff"], // azul → cian
  ["#39ff14", "#00ff7f", "#adff2f", "#7fff00"], // verde → lima
  ["#9400d3", "#8a2be2", "#9932cc", "#da70d6"], // púrpura → violeta
];

// Configuración inicial
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 8;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

let rightPressed = false;
let leftPressed = false;

// Bloques
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth = 55;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = 35;

let currentPalette = neonPalettes[Math.floor(Math.random() * neonPalettes.length)];
let bricks = [];

function generateBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const color = currentPalette[r % currentPalette.length];
      bricks[c][r] = { x: 0, y: 0, status: 1, color };
    }
  }
}

generateBricks();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function collisionDetection() {
  let allCleared = true;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        allCleared = false;
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 10;
          document.getElementById("score").textContent = "💎 Puntuación: " + score;
        }
      }
    }
  }

  // Si se destruyeron todos los bloques → regenerar con nueva paleta
  if (allCleared) {
    currentPalette = neonPalettes[Math.floor(Math.random() * neonPalettes.length)];
    generateBricks();
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0ff";
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#f0f";
  ctx.shadowColor = "#f0f";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.shadowColor = bricks[c][r].color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius - 10) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("💀 Fin del juego 💀");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
  else if (leftPressed && paddleX > 0) paddleX -= 6;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
