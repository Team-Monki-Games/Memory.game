// scriptF.js - Flappy Bird Cyberpunk (robusto y con reinicio limpio)

const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");

const W = canvas.width;
const H = canvas.height;

// Bird
const bird = {
  x: 80,
  y: 250,
  w: 30,
  h: 30,
  gravity: 0.45,
  lift: -8,
  velocity: 0
};

// Pipes array
let pipes = [];

// Game state
let score = 0;
let gameOver = false;
let running = false;
let frame = 0;

const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_INTERVAL_FRAMES = 90;
const PIPE_SPEED = 3;

// Controls
function onJump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
  } else {
    resetGame();
  }
}
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") onJump();
});
document.addEventListener("click", onJump);

// Helpers
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// Reset game state
function resetGame() {
  bird.y = H * 0.4;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  scoreEl.textContent = `💎 Puntuación: ${score}`;
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}

// Draw background grid
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#020024");
  gradient.addColorStop(1, "#090979");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = "#0ff";
  for (let i = 0; i < W; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  for (let j = 0; j < H; j += 40) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(W, j);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBird() {
  ctx.save();
  ctx.fillStyle = "#0ff";
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 20;
  ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
  ctx.restore();

  // wing glow
  ctx.save();
  if (Math.floor(frame / 8) % 2 === 0) {
    ctx.fillStyle = "#00ffd5";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(bird.x + 6, bird.y + bird.h / 2 - 6, 10, 6);
  }
  ctx.restore();
}

function drawPipes() {
  ctx.save();
  ctx.fillStyle = "#f0f";
  ctx.shadowColor = "#f0f";
  ctx.shadowBlur = 30;
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);
    ctx.fillRect(p.x, p.bottom, PIPE_WIDTH, H - p.bottom);
  });
  ctx.restore();
}

function drawScore() {
  scoreEl.textContent = `💎 Puntuación: ${score}`;
}

// Game loop
function loop() {
  if (gameOver) {
    running = false;
    drawGameOver();
    return;
  }

  frame++;
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % PIPE_INTERVAL_FRAMES === 0) {
    const top = rand(50, H - PIPE_GAP - 80);
    pipes.push({ x: W, top: top, bottom: top + PIPE_GAP, passed: false });
  }

  pipes.forEach(p => (p.x -= PIPE_SPEED));
  pipes = pipes.filter(p => p.x + PIPE_WIDTH > -50);

  pipes.forEach(p => {
    if (!p.passed && p.x + PIPE_WIDTH < bird.x) {
      p.passed = true;
      score++;
      drawScore();
    }

    const hitX = bird.x < p.x + PIPE_WIDTH && bird.x + bird.w > p.x;
    const hitY = bird.y < p.top || bird.y + bird.h > p.bottom;
    if (hitX && hitY) {
      gameOver = true;
    }
  });

  if (bird.y + bird.h > H || bird.y < 0) {
    gameOver = true;
  }

  drawBackground();
  drawPipes();
  drawBird();
  drawScore();

  requestAnimationFrame(loop);
}

function drawGameOver() {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#f0f";
  ctx.font = "bold 36px Orbitron";
  ctx.textAlign = "center";
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 20;
  ctx.fillText("💀 GAME OVER 💀", W / 2, H / 2 - 10);

  ctx.font = "18px Orbitron";
  ctx.fillText("Presiona una tecla o haz clic para reiniciar", W / 2, H / 2 + 30);
  ctx.restore();
}

// Iniciar juego
resetGame();
