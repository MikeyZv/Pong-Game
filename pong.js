const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const highScore = document.querySelector("#highScore");
const playerScore = document.querySelector("#playerScore");
const easyDiffBtn = document.querySelector("#easyBtn");
const mediumDiffBtn = document.querySelector("#mediumBtn");
const hardDiffBtn = document.querySelector("#hardBtn");
const gameWidth =  gameBoard.width;
const gameHeight = gameBoard.height;
const boardColor = "white";
const compPaddleColor = "red";
const paddleColor = "blue";
const ballColor = "black";
const unitSize = 25;
let timeoutID;
let running = false;
let yVelocity = 0;
let highScoreNum = 0;
let scoreNum = 0;
let easy = 0;
let medium = 0;
let hard = 1;
let paddle = [
    {x:gameWidth - unitSize, y:0},
    {x:gameWidth - unitSize, y:unitSize},
    {x:gameWidth - unitSize, y:unitSize * 2},
    {x:gameWidth - unitSize, y:unitSize * 3},
    {x:gameWidth - unitSize, y:unitSize * 4}
];
let compPaddle = [
    {x:0, y:gameHeight - unitSize},
    {x:0, y:gameHeight - unitSize * 2},
    {x:0, y:gameHeight - unitSize * 3},
    {x:0, y:gameHeight - unitSize * 4},
    {x:0, y:gameHeight - unitSize * 5}
];

let ballXVelocity = unitSize;
let ballYVelocity = -unitSize;
let ball = {x:250, y:275};

//stops scrolling from key inputs
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

window.addEventListener("keydown", changeDirection);
easyDiffBtn.addEventListener("click", easyDifficulty);
mediumDiffBtn.addEventListener("click", mediumDifficulty);
hardDiffBtn.addEventListener("click", hardDifficulty);

gameStart();

function gameStart(){
    running = true;
    drawPaddle();
    drawCompPaddle();
    initBallCords();
    drawBall();
    nextTick();
};
function nextTick(){
    if (running == true) {
        timeoutID = setTimeout(()=>{
            clearBall();
            checkBallSurroundings();
            checkDifficulty();
            checkScore();
            moveBall();
            drawBall();
            nextTick();
        }, 100);
    }
};
function initBallCords(){
    const randNum = Math.floor(Math.random() * 4);
    switch(true){
        case(randNum == 0):
            ball.y = 225;
            break;
        case(randNum == 1):
            ball.y = 250;
            break;
        case(randNum == 2):
            ball.y = 275;
            break;
        case(randNum == 3):
            ball.y = 300;
            break;
    }
};
function drawBall(){
    ctx.fillStyle = ballColor;
    ctx.fillRect(ball.x, ball.y, unitSize, unitSize);
};
function moveBall(){
    ball.x += ballXVelocity;
    ball.y += ballYVelocity;
};
function checkBallSurroundings(){
    paddle.forEach(paddlePart => {
        //if ball hits left side of player paddle
        if (ball.x + unitSize == paddlePart.x && ball.y == paddlePart.y) {
            ballHitPaddle();
        }
    })

    compPaddle.forEach(paddlePart => {
        //if ball hits right side of computer paddle
        if (ball.x - unitSize == paddlePart.x && ball.y == paddlePart.y) {
            ballHitCompPaddle();
        }
    })

    switch(true){
        case(ball.y - unitSize < 0): //if balls hits roof boundary
            ballYVelocity = unitSize;
            break;
        case(ball.y + unitSize == gameHeight): //if balls hits floor boundary
            ballYVelocity = -unitSize;
            break;
        case(ball.x + unitSize == paddle[0].x && ball.y + unitSize == paddle[0].y): //if balls hits top left corner of player paddle
            ballYVelocity = -unitSize;
            ballXVelocity = -unitSize;
            break;
        case(ball.x == paddle[0].x && ball.y + unitSize == paddle[0].y): //if ball hits top of player paddle
            ballYVelocity = -unitSize;
            break;
        case(ball.x == paddle[4].x && ball.y - unitSize == paddle[4].y): //if ball hits bottom of player paddle
            ballYVelocity = unitSize;
            break;
        case(ball.x + unitSize == paddle[4].x && ball.y - unitSize == paddle[4].y): //if balls hits bottom left corner of player paddle
            ballYVelocity = unitSize;
            ballXVelocity = -unitSize;
            break;
        case(ball.x > gameWidth):
            displayGameOver();
            break;
        case(ball.x < 0):
            displayScored();
            break;
    }
};s
function ballHitPaddle(){
    ballXVelocity = -unitSize;
};
function ballHitCompPaddle(){
    ballXVelocity = unitSize;
};
function movePaddle(){
    paddle.forEach(paddlePart => {
        paddlePart.y += yVelocity;
    })
};
function drawPaddle(){
    ctx.fillStyle = paddleColor;
    paddle.forEach(paddlePart => {
        ctx.fillRect(paddlePart.x, paddlePart.y, unitSize, unitSize)
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const upArrow = 38;
    const downArrow = 40;
    const upW = 87;
    const downS = 83;

    switch(true){
        case((keyPressed == upArrow || keyPressed == upW) && paddle[0].y > 0):
            yVelocity = -unitSize;
            clearPaddle();
            movePaddle();
            drawPaddle();
            break;
        case((keyPressed == downArrow || keyPressed == downS) && paddle[4].y < gameHeight - unitSize):
            yVelocity = unitSize;
            clearPaddle();
            movePaddle();
            drawPaddle();
            break;
    }
};
function clearBall(){
    ctx.fillStyle = boardColor;
    ctx.fillRect(ball.x, ball.y, unitSize, unitSize);

};
function clearPaddle(){
    ctx.fillStyle = boardColor;
    paddle.forEach(paddlePart => {
        ctx.fillRect(paddlePart.x, paddlePart.y, unitSize, unitSize);
    })
};
function displayGameOver(){
    running = false;
    ctx.font = "70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    ctx.font = "25px sans-serif";
    ctx.fillText("PRESS 'SPACE' TO RESTART", gameWidth / 2, gameHeight - 200);  
    window.addEventListener("keydown", hardReset);
};
function displayScored(){
    running = false;
    scoreNum += 1;
    playerScore.textContent = scoreNum;
    ctx.font = "70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("SCORED!", gameWidth / 2, gameHeight / 2);
    ctx.font = "25px sans-serif";
    ctx.fillText("PRESS 'SPACE' TO CONTINUE", gameWidth / 2, gameHeight - 200);  
    window.addEventListener("keydown", softReset);
};
function resetGame(){
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    paddle = [
        {x:gameWidth - unitSize, y:0},
        {x:gameWidth - unitSize, y:unitSize},
        {x:gameWidth - unitSize, y:unitSize * 2},
        {x:gameWidth - unitSize, y:unitSize * 3},
        {x:gameWidth - unitSize, y:unitSize * 4}
    ];
    compPaddle = [
        {x:0, y:gameHeight - unitSize},
        {x:0, y:gameHeight - unitSize * 2},
        {x:0, y:gameHeight - unitSize * 3},
        {x:0, y:gameHeight - unitSize * 4},
        {x:0, y:gameHeight - unitSize * 5}
    ];
    ball = {x:250, y:275};
    ballXVelocity = unitSize;
    ballYVelocity = -unitSize;
    clearTimeout(timeoutID); 
    gameStart();
};
function hardReset(event){
    const keyPressed = event.keyCode;
    window.removeEventListener("keydown", hardReset);
    if (keyPressed == 32) {
        scoreNum = 0;
        playerScore.textContent = scoreNum;
        resetGame();
    }
};
function softReset(event){
    const keyPressed = event.keyCode; 
    window.removeEventListener("keydown", softReset);
    if (keyPressed == 32) {
        resetGame();
    }
};
function compPaddleLayer(sector){
    switch(true){
        case(compPaddle[4].y == 0): //first layer
            switch(true){
                case(sector == 1):
                    break;
                case(sector == 2):
                    moveDownCompPaddle(1);
                    break;
                case(sector == 3):
                    moveDownCompPaddle(2);
                    break;
                case(sector == 4):
                    moveDownCompPaddle(3);
                    break;
            }
            break;
        case(compPaddle[4].y == 125): //second layer
            switch(true){
                case(sector == 1):
                    moveUpCompPaddle(1);
                    break;
                case(sector == 2):
                    break;
                case(sector == 3):
                    moveDownCompPaddle(1);
                    break;
                case(sector == 4):
                    moveDownCompPaddle(2);
                    break;
            }
            break;
        case(compPaddle[4].y == 250): //third layer
            switch(true){
                case(sector == 1):
                    moveUpCompPaddle(2);
                    break;
                case(sector == 2):
                    moveUpCompPaddle(1);
                    break;
                case(sector == 3):
                    break;
                case(sector == 4):
                    moveDownCompPaddle(1);
                    break;
            }
            break;
        case(compPaddle[4].y == 375): //fouth layer
            switch(true){
                case(sector == 1):
                    moveUpCompPaddle(3);
                    break;
                case(sector == 2):
                    moveUpCompPaddle(2);
                    break;
                case(sector == 3):
                    moveUpCompPaddle(1);
                    break;
            }
            break;
    }
};
function detectBallTrajectory(){
    const goingTopLeft = (ballYVelocity == -unitSize);

    if (ball.x < 250 && ball.x >= 225) {
        switch(true) {
            case(ball.y >= 450):
                compPaddleLayer(3);
                //3
                break;
            case(ball.y >= 400):
                if (goingTopLeft) {
                    compPaddleLayer(2);
                } else {
                    compPaddleLayer(3);
                }
                break;
            case(ball.y >= 325):
                if (goingTopLeft) {
                    compPaddleLayer(2);
                } else {
                    compPaddleLayer(4);
                }
                break;
            case(ball.y >= 175):
                if (goingTopLeft) {
                    compPaddleLayer(1);
                } else {
                    compPaddleLayer(4);
                }
                break;
            case(ball.y >= 100):
                if (goingTopLeft) {
                    compPaddleLayer(1);
                } else {
                    compPaddleLayer(3);
                }
                break;
            case(ball.y >= 50):
                if (goingTopLeft) {
                    compPaddleLayer(2);
                } else {
                    compPaddleLayer(3);
                }
                break;
            case(ball.y >= 0):
                compPaddleLayer(2);
                //2
                break;
        }
    }
};
function drawCompPaddle(){
    ctx.fillStyle = compPaddleColor;
    compPaddle.forEach(paddlePart => {
        ctx.fillRect(paddlePart.x, paddlePart.y, unitSize, unitSize)
    })
};
function incrCompPadCords(){
    compPaddle.forEach(paddlePart => {
        paddlePart.y += unitSize;
    })
};
function decrCompPadCords(){
    compPaddle.forEach(paddlePart => {
        paddlePart.y -= unitSize;
    })
};
function clearCompPaddle(){
    ctx.fillStyle = boardColor;
    compPaddle.forEach(paddlePart => {
        ctx.fillRect(paddlePart.x, paddlePart.y, unitSize, unitSize);
    })
};
function moveDownCompPaddle(number){
    for (let i = 0; i < 5 * number; i++) {
        clearCompPaddle();
        incrCompPadCords();
        drawCompPaddle();
    }
};
function moveUpCompPaddle(number){
    for (let i = 0; i < 5 * number; i++) {
        clearCompPaddle();
        decrCompPadCords();
        drawCompPaddle();
    }
};
function easyDifficulty(){
    easy = 1;
    medium = 0;
    hard = 0;
};
function mediumDifficulty(){
    easy = 0;
    medium = 1;
    hard = 0;
};
function hardDifficulty(){
    easy = 0;
    medium = 0;
    hard = 1;
};
function checkDifficulty(){
    const randNum = (Math.random() * 100) + 1;
    switch(true){
        case(easy == 1):
            if (randNum <= 60) {
                detectBallTrajectory();
            }
            break;
        case(medium == 1):
            if (randNum <= 75) {
                detectBallTrajectory();
            }
            break;
        case(hard == 1):
            if (randNum <= 95) {
                detectBallTrajectory();
            }
            break;
    }
};
function checkScore(){
    if (scoreNum > highScoreNum){
        highScore.textContent = scoreNum;
    }
}

/*function drawGrid(){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    for (let i = 0; i < 500; i+=25) {
        for (let j = 0; j < 500; j+=25) {
            ctx.fillRect(i, j, unitSize, unitSize);
            ctx.strokeRect(i, j, unitSize, unitSize);
        }
    } 
};
*/
