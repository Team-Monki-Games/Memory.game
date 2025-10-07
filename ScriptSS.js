const canvas = document.getElementById("shooterCanvas");
const ctx = canvas.getContext("2d");

const cols = 6;
const colWidth = canvas.width / cols;

let player, bullets, enemies, score, lives, gameOver;
let enemySpeed, spawnCooldownTime, spawnProbability;
let lastSpawnTime = [];
let invulnerable = false;
let invulnerableStart = 0;

const restartBtn = document.getElementById("restartBtn");

function initGame() {
  player = { col: 2, y: canvas.height - 60, width: 40, height: 30, visible: true };
  bullets = [];
  enemies = [];
  score = 0;
  lives = 5;
  gameOver = false;
  invulnerable = false;
  restartBtn.style.display = "none";

  lastSpawnTime = Array(cols).fill(0);

  const diff = document.getElementById("difficulty").value;
  switch (diff) {
    case "easy":
      enemySpeed = 1.2;
      spawnCooldownTime = 2000; // 2s
      spawnProbability = 0.007; // 0.7%
      break;
    case "medium":
      enemySpeed = 1.7;
      spawnCooldownTime = 1500; // 1.5s
      spawnProbability = 0.013; // 1.3%
      break;
    case "hard":
      enemySpeed = 2.2;
      spawnCooldownTime = 1000; // 1s
      spawnProbability = 0.02; // 2%
      break;
  }

  updateHUD();
  gameLoop();
}

function drawPlayer() {
  if (player.visible) {
    const x = player.col * colWidth + (colWidth - player.width) / 2;
    ctx.fillStyle = "#0ff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#0ff";
    ctx.fillRect(x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
  }
}

function drawBullets() {
  ctx.fillStyle = "#f0f";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
    ctx.shadowBlur = 0;
  });
}

function moveBullets() {
  bullets.forEach(b => b.y -= 7);
  bullets = bullets.filter(b => b.y > 0);
}

function moveEnemies() {
  const now = Date.now();
  enemies.forEach((e, index) => {
    e.y += enemySpeed;

    // Cuando un enemigo pasa sin chocar
    if (e.y + e.height >= canvas.height) {
      enemies.splice(index, 1);
      if (!invulnerable) {
        lives--;
        updateHUD();
        invulnerable = true;
        invulnerableStart = now;
      }
    }

    // Golpea jugador
    if (e.y + e.height >= player.y && e.col === player.col && !invulnerable) {
      lives--;
      updateHUD();
      invulnerable = true;
      invulnerableStart = now;
      enemies.splice(index, 1);
    }
  });

  // Fin de invulnerabilidad después de 1.5s
  if (invulnerable && now - invulnerableStart >= 1500) {
    invulnerable = false;
    player.visible = true;
  }

  // Parpadeo durante invulnerabilidad
  if (invulnerable) {
    player.visible = Math.floor(now / 100) % 2 === 0;
  }

  if (lives <= 0) endGame();
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + e.width &&
        b.x + 4 > e.x &&
        b.y < e.y + e.height &&
        b.y + 10 > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 100;
        updateHUD();
      }
    });
  });
}

function spawnEnemies() {
  const now = Date.now();

  for (let i = 0; i < cols; i++) {
    const isAvailable = now - lastSpawnTime[i] >= spawnCooldownTime;
    const spawnChance = Math.random() < spawnProbability;

    if (isAvailable && spawnChance) {
      enemies.push({
        col: i,
        x: i * colWidth + (colWidth - 40) / 2,
        y: 0,
        width: 40,
        height: 25,
        color: darkColor()
      });
      lastSpawnTime[i] = now;
    }
  }
}

function darkColor() {
  const palette = [
    "#7f00ff", "#ff0044", "#00ccaa", "#9900ff",
    "#aa0033", "#00bbaa", "#ff2200", "#4400ff",
    "#0044aa", "#ff0077", "#006666"
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

function updateHUD() {
  document.getElementById("score").textContent = `💎 Puntuación: ${score}`;
  document.getElementById("lives").textContent = `❤️ Vidas: ${lives}`;
}

function endGame() {
  gameOver = true;
  restartBtn.style.display = "inline-block";
  ctx.fillStyle = "#f0f";
  ctx.font = "30px Orbitron";
  ctx.textAlign = "center";
  ctx.fillText("💀 GAME OVER 💀", canvas.width / 2, canvas.height / 2);
  ctx.font = "18px Orbitron";
  ctx.fillText("Presiona el botón para volver a jugar", canvas.width / 2, canvas.height / 2 + 40);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
}

function gameLoop() {
  if (gameOver) return;
  spawnEnemies();
  moveBullets();
  moveEnemies();
  detectCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && player.col > 0) player.col--;
  if (e.key === "ArrowRight" && player.col < cols - 1) player.col++;
  if (e.key === " " || e.key === "ArrowUp") {
    const x = player.col * colWidth + (colWidth - 4) / 2;
    bullets.push({ x: x, y: player.y });
  }
});

restartBtn.addEventListener("click", initGame);

initGame();
