// component.js

// ------ Load Img ------ //

// Load Bg Img
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.svg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.svg";

// End Load Img

// ------------------------------------------ //

// Load Sound
const WALL_HIT = new Audio();
WALL_HIT.src = "sound/wall.mp3";
// WALL_SOUND.play();

// WALL_SOUND.muted = true;
// WALL_SOUND.muted = false;

// Ball Paddle Collision
const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sound/paddle_hit.mp3";

// Life Lost
const LIFE_LOST = new Audio();
LIFE_LOST.src = "sound/life_lost.mp3";

// Ball Brick Collision
const BRICK_HIT = new Audio();
BRICK_HIT.src = "sound/brick_hit.mp3";

// Win Game
const WIN = new Audio();
WIN.src = "sound/win.mp3";

// End Load Sound
