const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paletas
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
let playerY = HEIGHT/2 - PADDLE_HEIGHT/2;
let aiY = HEIGHT/2 - PADDLE_HEIGHT/2;

// Pelota
let ballX = WIDTH/2;
let ballY = HEIGHT/2;
let ballRadius = 8;
let ballSpeedX = 7; // más rápida que las paletas
let ballSpeedY = 7;

// Puntaje
let playerScore = 0;
let aiScore = 0;

// Control paleta jugador
let upPressed = false;
let downPressed = false;
document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") upPressed = true;
    else if(e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", e => {
    if(e.key === "ArrowUp") upPressed = false;
    else if(e.key === "ArrowDown") downPressed = false;
});

// Dibujar paletas y pelota
function drawPaddle(x,y){
    ctx.fillStyle = "#0ff";
    ctx.fillRect(x,y,PADDLE_WIDTH,PADDLE_HEIGHT);
}
function drawBall(){
    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, false);
    ctx.fill();
}

// Reiniciar pelota
function resetBall(){
    ballX = WIDTH/2;
    ballY = HEIGHT/2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 7;  // velocidad más alta
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 7;
}

// Dibujar juego completo
function draw(){
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    drawPaddle(0,playerY);
    drawPaddle(WIDTH-PADDLE_WIDTH, aiY);
    drawBall();

    ctx.fillStyle = "#ff0";
    ctx.font = "20px Orbitron";
    ctx.fillText("Jugador: "+playerScore, 20, 25);
    ctx.fillText("AI: "+aiScore, WIDTH-90,25);
}

// Lógica
function update(){
    // mover paleta jugador
    if(upPressed && playerY>0) playerY -= 8;      // más rápida
    if(downPressed && playerY + PADDLE_HEIGHT < HEIGHT) playerY += 8;

    // mover paleta AI
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if(aiCenter < ballY) aiY += 6;                // más rápida
    else aiY -= 6;

    // mover pelota
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // colisiones con paredes
    if(ballY - ballRadius <0 || ballY + ballRadius>HEIGHT) ballSpeedY = -ballSpeedY;

    // colisiones con paletas
    if(ballX - ballRadius < PADDLE_WIDTH && ballY > playerY && ballY < playerY + PADDLE_HEIGHT){
        ballSpeedX = -ballSpeedX;
    }
    if(ballX + ballRadius > WIDTH - PADDLE_WIDTH && ballY > aiY && ballY < aiY + PADDLE_HEIGHT){
        ballSpeedX = -ballSpeedX;
    }

    // marcar puntos
    if(ballX - ballRadius <0){
        aiScore++;
        resetBall();
    }
    if(ballX + ballRadius > WIDTH){
        playerScore++;
        resetBall();
    }
}

// Loop principal
let game = setInterval(()=>{
    update();
    draw();
}, 30);

// Botón reiniciar
restartBtn.addEventListener("click", ()=>{
    playerScore = 0;
    aiScore = 0;
    playerY = HEIGHT/2 - PADDLE_HEIGHT/2;
    aiY = HEIGHT/2 - PADDLE_HEIGHT/2;
    resetBall();
});
