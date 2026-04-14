const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const streakDisplay = document.getElementById("streak");
const finalScoreDisplay = document.getElementById("finalScore");
const hud = document.getElementById("hud");
const message = document.getElementById("message");

let score = 0;
let timeLeft = 30;
let streak = 0;
let gameRunning = false;
let timerInterval = null;
let spawnTimeout = null;
let activeFalls = [];

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

function startGame() {
  score = 0;
  timeLeft = 30;
  streak = 0;
  gameRunning = true;

  updateHUD();
  clearGameArea();

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameArea.classList.remove("hidden");
  hud.classList.remove("hidden");
  message.classList.remove("hidden");
  message.textContent = "Collect clean drops for points.";

  timerInterval = setInterval(() => {
    timeLeft--;
    updateHUD();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnDrops();
}

function spawnDrops() {
  if (!gameRunning) return;

  createDrop();

  const delay = Math.random() * 500 + 500;
  spawnTimeout = setTimeout(spawnDrops, delay);
}

function createDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");

  const isClean = Math.random() < 0.75;
  if (isClean) {
    drop.classList.add("clean");
  } else {
    drop.classList.add("bad");
  }

  const maxLeft = gameArea.clientWidth - 42;
  drop.style.left = Math.random() * maxLeft + "px";
  drop.style.top = "0px";

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isClean) {
      streak++;
      const pointsEarned = 10 + (streak - 1) * 2;
      score += pointsEarned;
      message.textContent = `Nice! +${pointsEarned} points`;
    } else {
      score -= 20;
      streak = 0;
      message.textContent = "Polluted drop! -20 points";
    }

    updateHUD();
    removeDrop(drop);
  });

  gameArea.appendChild(drop);

  let speed = Math.random() * 2 + 2.5;

  const fallInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fallInterval);
      return;
    }

    let currentTop = parseFloat(drop.style.top);
    currentTop += speed;
    drop.style.top = currentTop + "px";

    if (currentTop > gameArea.clientHeight) {
      if (isClean) {
        streak = 0;
        message.textContent = "You missed a clean drop!";
        updateHUD();
      }
      removeDrop(drop);
      clearInterval(fallInterval);
    }
  }, 30);

  activeFalls.push(fallInterval);
}

function removeDrop(drop) {
  if (drop && drop.parentNode === gameArea) {
    drop.remove();
  }
}

function updateHUD() {
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  streakDisplay.textContent = `Streak: ${streak}`;
}

function endGame() {
  gameRunning = false;

  clearInterval(timerInterval);
  clearTimeout(spawnTimeout);

  activeFalls.forEach(interval => clearInterval(interval));
  activeFalls = [];

  clearGameArea();

  gameArea.classList.add("hidden");
  hud.classList.add("hidden");
  message.classList.add("hidden");

  finalScoreDisplay.textContent = `Final Score: ${score}`;
  endScreen.classList.remove("hidden");
}

function resetGame() {
  startGame();
}

function clearGameArea() {
  gameArea.innerHTML = "";
}