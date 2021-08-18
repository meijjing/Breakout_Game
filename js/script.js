// script.js

// Select Canvas Element
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// Add border to canvas
cvs.style.border = "1px solid #eee";

// Make line thik when drawing to canvas
cvs.lineWidth = 3;

// Game Variables and Contants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;

let leftArrow = false;
let rightArrow = false;

const BALL_RADIUS = 8;

let LIFE = 3; // player has 3 lives
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;

let GAME_OVER = false;

const gamestart = document.querySelector(".gamestart");
const start_btn = document.getElementById("start");

// ---------------------------------------- //
//                  Paddle                  //
// ---------------------------------------- //
// Create the Paddle
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

// Draw the Paddle
function drawPaddle() {
  ctx.fillStyle = "#ff7816";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = "#144151";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Control the Paddle
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37) {
    leftArrow = true;
  } else if (e.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", function (e) {
  if (e.keyCode == 37) {
    leftArrow = false;
  } else if (e.keyCode == 39) {
    rightArrow = false;
  }
});

// Move the Paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

// ---------------------------------------- //
//                   Ball                   //
// ---------------------------------------- //
// Create the Ball
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

// Draw the Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd400";
  ctx.fill();
  ctx.strokeStyle = "#ffd400";
  ctx.stroke();
  ctx.closePath();
}

// Move the Ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// ---------------------------------------- //
//                  Brick                   //
// ---------------------------------------- //
// Create bricks
const brick = {
  row: 3,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#144151",
  strokeColor: "#fff",
};

let bricks = [];
function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true, // brickdl 깨지는지 아닌지
      };
    }
  }
}
createBricks();

// Draw Bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      if (bricks[r][c].status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);

        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(
          bricks[r][c].x,
          bricks[r][c].y,
          brick.width,
          brick.height
        );
      }
    }
  }
}

// ---------------------------------------- //
//         Ball ane Wall Collision          //
// ---------------------------------------- //
// Ball ane Wall Collision
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }
  if (ball.y + ball.radius > cvs.height) {
    LIFE--; // Lose Life
    LIFE_LOST.play();
    resetBall();
  }
}

// Ball and Paddle Collision
function ballPaddleCollision() {
  if (
    ball.y > paddle.y &&
    ball.y < paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    PADDLE_HIT.play();

    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = collidePoint * (Math.PI / 3);

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

// Reset the Ball
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1); // 1과 -1사이의 랜덤
  ball.dy = -3;
}

// ---------------------------------------- //
//         Ball ane Brick Collision         //
// ---------------------------------------- //
// Ball and Brick Collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];

      // 블럭이 깨지지 않았다면
      if (b.status) {
        // brick false 만들기
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          b.status = false; // the brick is broken
          ball.dy = -ball.dy;
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

// Show Game Stats
function showGameStats(text, textX, textY, img, imgX, imgY) {
  ctx.fillStyle = "#fff";
  ctx.font = "25px Noto Sans KR";
  ctx.fillText(text, textX, textY);
  ctx.drawImage(img, imgX, imgY, 25, 25);
}

// Game Over
function gameOver() {
  if (LIFE <= 0) {
    GAME_OVER = true;
    showYouLose();
  }
}

// Level Up
function levelUp() {
  let isLevelDone = true;

  // 모든 블럭이 깨졌는지 확인
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }
  if (isLevelDone) {
    WIN.play();
    if (LEVEL > MAX_LEVEL) {
      GAME_OVER = true;
      showYouWin();
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    LEVEL++;
  }
}

// ---------------------------------------- //
//               Draw & Update              //
// ---------------------------------------- //
// Draw Function
function draw() {
  drawPaddle();
  drawBall();
  drawBricks();

  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

// Update Game Funtion
function update() {
  movePaddle();
  moveBall();

  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();

  gameOver();
  levelUp();
}

// Game Loop
function loop() {
  // Cleaer cvs
  ctx.drawImage(BG_IMG, 0, 0);
  draw();
  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
// loop();

// Click the Start_btn
start_btn.addEventListener("click", function () {
  gamestart.style.display = "none";
  loop();
});

// Select Sound
const soundElement = document.getElementById("sound");
WALL_HIT.muted = true;
PADDLE_HIT.muted = true;
LIFE_LOST.muted = true;
BRICK_HIT.muted = true;
WIN.muted = true;

// 음소거 버튼 클릭 시

soundElement.addEventListener("click", function () {
  // change img
  let imgSrc = soundElement.getAttribute("src");
  let SOUND_IMG =
    imgSrc == "img/SOUND_OFF.svg" ? "img/SOUND_ON.svg" : "img/SOUND_OFF.svg";

  soundElement.setAttribute("src", SOUND_IMG);

  // mute sound
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
});

// Show Gameover Message
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
const yes = document.getElementById("yes");
const no = document.getElementById("no");

// restart.addEventListener("click", function () {
//   location.reload();
// });

yes.addEventListener("click", function () {
  location.reload();
  gamestart.style.display = "none";
  loop();
});

no.addEventListener("click", function () {
  location.reload();
});

function showYouWin() {
  gameover.style.display = "block";
  youwin.style.display = "block";
  restart.style.display = "block";
}

function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
  restart.style.display = "block";
}
