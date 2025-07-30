// Game Area Setup
let canvas;
let ctx;
const canvasWidth = 360;
const canvasHeight = 576;

// Player (Jumper)
const jumperWidth = 46;
const jumperHeight = 46;
let jumperPosX = canvasWidth / 2 - jumperWidth / 2;
let jumperPosY = canvasHeight * 7 / 8 - jumperHeight;
let jumperImgRight;
let jumperImgLeft;

let jumper = {
    img: null,
    x: jumperPosX,
    y: jumperPosY,
    width: jumperWidth,
    height: jumperHeight
};

// Motion Physics
let moveX = 0;
let moveY = 0;
const jumpStartVelocity = -8;
const gravityForce = 0.4;

// Platforms
let platforms = [];
const platWidth = 60;
const platHeight = 18;
let platImg;

// Scoring & Game State
let score = 0;
let highScore = 0;
let isGameOver = false;

window.onload = () => {
    canvas = document.getElementById("board");
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    ctx = canvas.getContext("2d");

    // Load Sprites
    jumperImgRight = new Image();
    jumperImgRight.src = "./doodler-right.png";
    jumper.img = jumperImgRight;
    jumperImgRight.onload = () => {
        ctx.drawImage(jumper.img, jumper.x, jumper.y, jumper.width, jumper.height);
    }

    jumperImgLeft = new Image();
    jumperImgLeft.src = "./doodler-left.png";

    platImg = new Image();
    platImg.src = "./platform.png";

    moveY = jumpStartVelocity;
    setupPlatforms();
    requestAnimationFrame(gameLoop);
    document.addEventListener("keydown", controlJumper);
};

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jumper Movement
    jumper.x += moveX;
    if (jumper.x > canvasWidth) jumper.x = 0;
    else if (jumper.x + jumper.width < 0) jumper.x = canvasWidth;

    moveY += gravityForce;
    jumper.y += moveY;
    if (jumper.y > canvasHeight) isGameOver = true;

    ctx.drawImage(jumper.img, jumper.x, jumper.y, jumper.width, jumper.height);

    // Platform Behavior
    platforms.forEach((plat, idx) => {
        if (moveY < 0 && jumper.y < canvasHeight * 3 / 4) {
            plat.y -= jumpStartVelocity;
        }
        if (checkHit(jumper, plat) && moveY >= 0) {
            moveY = jumpStartVelocity;
        }
        ctx.drawImage(plat.img, plat.x, plat.y, plat.width, plat.height);
    });

    // Recycle Platforms
    while (platforms.length > 0 && platforms[0].y >= canvasHeight) {
        platforms.shift();
        addNewPlatform();
    }

    displayScore();

    if (isGameOver) {
        ctx.fillText("Game Over: Press 'Space' to Restart", canvasWidth / 7, canvasHeight * 7 / 8);
    }
}

function controlJumper(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
        moveX = 4;
        jumper.img = jumperImgRight;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        moveX = -4;
        jumper.img = jumperImgLeft;
    } else if (e.code === "Space" && isGameOver) {
        resetGame();
    }
}

function setupPlatforms() {
    platforms = [];

    let startingPlat = {
        img: platImg,
        x: canvasWidth / 2,
        y: canvasHeight - 50,
        width: platWidth,
        height: platHeight
    };
    platforms.push(startingPlat);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * canvasWidth * 3 / 4);
        let newPlat = {
            img: platImg,
            x: randomX,
            y: canvasHeight - 75 * i - 150,
            width: platWidth,
            height: platHeight
        };
        platforms.push(newPlat);
    }
}

function addNewPlatform() {
    let randomX = Math.floor(Math.random() * canvasWidth * 3 / 4);
    let newPlat = {
        img: platImg,
        x: randomX,
        y: -platHeight,
        width: platWidth,
        height: platHeight
    };
    platforms.push(newPlat);
}

function checkHit(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function displayScore() {
    let gainedPoints = Math.floor(50 * Math.random());
    if (moveY < 0) {
        highScore += gainedPoints;
        if (score < highScore) score = highScore;
    } else if (moveY >= 0) {
        highScore -= gainedPoints;
    }

    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";
    ctx.fillText(score, 5, 20);
}

function resetGame() {
    jumper = {
        img: jumperImgRight,
        x: jumperPosX,
        y: jumperPosY,
        width: jumperWidth,
        height: jumperHeight
    };

    moveX = 0;
    moveY = jumpStartVelocity;
    score = 0;
    highScore = 0;
    isGameOver = false;
    setupPlatforms();
}

