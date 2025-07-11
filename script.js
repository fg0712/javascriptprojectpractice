let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");

let scale = 20;
let rows = canvas.height / scale;
let columns = canvas.width / scale;

let snake = [];
let food;
let d = "right";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 200;
let isPaused = false;
let timer = 60;
let foodColor = "red";

document.getElementById("highscore").textContent = "High Score: " + highScore;
let eatSound = document.getElementById("eat-sound");

snake[0] = {
  x: Math.floor(columns / 2) * scale,
  y: Math.floor(rows / 2) * scale
};

function createFood() {
  food = {
    x: Math.floor(Math.random() * columns) * scale,
    y: Math.floor(Math.random() * rows) * scale
  };
  foodColor = getRandomColor();
}
createFood();

function getRandomColor() {
  const colors = ["red", "yellow", "cyan", "blue", "magenta", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Timer Countdown
let timerInterval = setInterval(() => {
  if (!isPaused) {
    timer--;
    document.getElementById("timer").textContent = "Time: " + timer + "s";
    if (timer <= 0) {
      clearInterval(game);
      clearInterval(timerInterval);
      alert("⏱️ Time Up! Your Score: " + score);
      updateHighScore();
      location.reload();
    }
  }
}, 1000);

// Keyboard controls
document.addEventListener("keydown", direction);
function direction(e) {
  let key = e.keyCode;
  if ((key === 37 || key === 65) && d != "right") d = "left";
  else if ((key === 38 || key === 87) && d != "down") d = "up";
  else if ((key === 39 || key === 68) && d != "left") d = "right";
  else if ((key === 40 || key === 83) && d != "up") d = "down";
}

// Touch controls
function setDirection(dir) {
  if (dir === "left" && d != "right") d = "left";
  else if (dir === "right" && d != "left") d = "right";
  else if (dir === "up" && d != "down") d = "up";
  else if (dir === "down" && d != "up") d = "down";
}

function togglePause() {
  isPaused = !isPaused;
}

function draw() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, scale, scale);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "#0f0" : "#fff";
    ctx.strokeStyle = "#000";
    ctx.strokeRect(snake[i].x, snake[i].y, scale, scale);
    ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
  }

  // Move snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "left") snakeX -= scale;
  if (d == "up") snakeY -= scale;
  if (d == "right") snakeX += scale;
  if (d == "down") snakeY += scale;

  // Edge wrap
  if (snakeX < 0) snakeX = canvas.width - scale;
  if (snakeX >= canvas.width) snakeX = 0;
  if (snakeY < 0) snakeY = canvas.height - scale;
  if (snakeY >= canvas.height) snakeY = 0;

  // Self collision
  if (collision(snakeX, snakeY, snake)) {
    clearInterval(game);
    clearInterval(timerInterval);
    alert("💥 Game Over! Your score: " + score);
    updateHighScore();
    location.reload();
  }

  // Eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    eatSound.play();
    createFood();
    increaseSpeed();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);
}

function collision(x, y, array) {
  for (let i = 1; i < array.length; i++) {
    if (x == array[i].x && y == array[i].y) return true;
  }
  return false;
}

function updateHighScore() {
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    document.getElementById("highscore").textContent = "High Score: " + score;
  }
}

function increaseSpeed() {
  clearInterval(game);
  speed = Math.max(50, speed - 10); // cap minimum speed
  game = setInterval(draw, speed);
}

let game = setInterval(draw, speed);
