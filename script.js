let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");

let scale = 20;
let rows = canvas.height / scale;
let columns = canvas.width / scale;

let snake = [];
let food;
let d = "right";
let score = 0;

snake[0] = {
  x: Math.floor(columns / 2) * scale,
  y: Math.floor(rows / 2) * scale
};

function createFood() {
  food = {
    x: Math.floor(Math.random() * columns) * scale,
    y: Math.floor(Math.random() * rows) * scale
  };
}
createFood();

// Keyboard controls (Arrow Keys + WASD)
document.addEventListener("keydown", direction);
function direction(e) {
  let key = e.keyCode;
  if ((key === 37 || key === 65) && d != "right") d = "left";  // Left / A
  else if ((key === 38 || key === 87) && d != "down") d = "up"; // Up / W
  else if ((key === 39 || key === 68) && d != "left") d = "right"; // Right / D
  else if ((key === 40 || key === 83) && d != "up") d = "down";  // Down / S
}

// Touch button control function
function setDirection(dir) {
  if (dir === "left" && d != "right") d = "left";
  else if (dir === "right" && d != "left") d = "right";
  else if (dir === "up" && d != "down") d = "up";
  else if (dir === "down" && d != "up") d = "down";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
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

  // Wall or self collision
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    collision(snakeX, snakeY, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);
    location.reload();
  }

  // Eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    createFood();
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

let game = setInterval(draw, 200);
