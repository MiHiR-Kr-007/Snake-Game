const board = document.querySelector('.board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const before = document.querySelector('.before');
const again = document.querySelector('.again');
const result = document.querySelector('.result');
const mode = document.querySelector('#mode');
const toggleBtn = document.querySelector('#toggle');
const controller = document.querySelector('.controller');
const arrows = document.querySelectorAll('.arrow');

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let useController = false;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changefoodpos = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const endGame = () => {
    clearInterval(setIntervalId);
    before.style.visibility = 'visible';
    result.innerHTML = `Your Score is ${score}`;
    again.onclick = () => {
        location.reload();
    };
};

const changeDirection = e => {
    if (!useController) {
        if (e.key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
};

const controllerdirection = direction => {
    if (useController) {
        switch (direction) {
            case "up":
                velocityX = 0;
                velocityY = -1;
                break;
            case "down":
                velocityX = 0;
                velocityY = 1;
                break;
            case "left":
                velocityX = -1;
                velocityY = 0;
                break;
            case "right":
                velocityX = 1;
                velocityY = 0;
                break;
            default:
                break;
        }
    }
};


const initGame = () => {
    if (gameOver) return endGame();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changefoodpos();
        snakeBody.push([0, 0]);
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
        }
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="pos" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    board.innerHTML = html;
};

controller.classList.add('hidden');

toggleBtn.addEventListener('click', () => {
    useController = !useController;
    controller.classList.toggle('hidden', !useController);
    if (useController) {
        document.removeEventListener('keydown', changeDirection);
    } else {
        document.addEventListener('keydown', changeDirection);
    }
});


arrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
        const direction = arrow.classList[0];
        controllerdirection(direction);
    });
});

changefoodpos();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keydown", changeDirection);
