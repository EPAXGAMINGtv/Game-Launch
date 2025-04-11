const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 600;

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const BORDER_WIDTH = 3;
let FALL_SPEED = 500;

let board = [];
let lastTime = 0;
let currentTetromino;
let nextTetromino;
let currentRow = 0;
let currentCol = 4;
let level = 1;
let score = 0;
let gameOver = false;
let timeElapsed = 0;

function createBoard() {
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLUMNS; c++) {
            board[r][c] = 'empty';
        }
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Raster zeichnen mit neonfarbenem Rand
    ctx.lineWidth = BORDER_WIDTH;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
            ctx.strokeStyle = '#00FF00'; // Neon-Grün für das Netz
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    // Spielfeld mit den Block-Farben zeichnen
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
            if (board[r][c] !== 'empty') {
                ctx.fillStyle = board[r][c];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#00FF00'; // Neon-Grüner Rand
                ctx.lineWidth = BORDER_WIDTH;
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

const TETROMINOS = [
    { color: '#00FF00', shape: [[1, 1, 1, 1]] },
    { color: '#00FF00', shape: [[1, 1], [1, 1]] },
    { color: '#00FF00', shape: [[0, 1, 0], [1, 1, 1]] },
    { color: '#00FF00', shape: [[1, 1, 0], [0, 1, 1]] },
    { color: '#00FF00', shape: [[0, 1, 1], [1, 1, 0]] },
    { color: '#00FF00', shape: [[1, 1, 1], [1, 0, 0]] },
    { color: '#00FF00', shape: [[1, 1, 1], [0, 0, 1]] }
];

function randomTetromino() {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    return TETROMINOS[randomIndex];
}

function drawTetromino() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c] === 1) {
                // Block mit Neon-Grünem Innenbereich und grün-weißem Rand
                ctx.fillStyle = '#00AA00'; // Dunkleres Neon-Grün
                ctx.fillRect((currentCol + c) * BLOCK_SIZE, (currentRow + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

                ctx.strokeStyle = '#FFFFFF'; // Weißer Außenrand
                ctx.lineWidth = BORDER_WIDTH;
                ctx.strokeRect((currentCol + c) * BLOCK_SIZE, (currentRow + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

                ctx.strokeStyle = '#00FF00'; // Neon-Grüner Rand
                ctx.lineWidth = BORDER_WIDTH;
                ctx.strokeRect((currentCol + c) * BLOCK_SIZE, (currentRow + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Draw the next tetromino preview
function drawNextTetromino() {
    ctx.fillStyle = nextTetromino.color;
    for (let r = 0; r < nextTetromino.shape.length; r++) {
        for (let c = 0; c < nextTetromino.shape[r].length; c++) {
            if (nextTetromino.shape[r][c] === 1) {
                ctx.fillRect(320 + c * BLOCK_SIZE, 100 + r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#00FF00'; // Neon-Grüner Rand
                ctx.lineWidth = BORDER_WIDTH;
                ctx.strokeRect(320 + c * BLOCK_SIZE, 100 + r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function moveTetromino() {
    currentRow++;
    if (collision()) {
        currentRow--;
        placeTetromino();
        checkForLineClears();
        currentTetromino = nextTetromino;
        nextTetromino = randomTetromino();
        currentRow = 0;
        currentCol = 4;
    }
}

function collision() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c] === 1) {
                const newRow = currentRow + r;
                const newCol = currentCol + c;
                if (newRow >= ROWS || newCol < 0 || newCol >= COLUMNS || board[newRow][newCol] !== 'empty') {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeTetromino() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c] === 1) {
                board[currentRow + r][currentCol + c] = currentTetromino.color;
            }
        }
    }
}

function rotateTetromino() {
    const tempShape = currentTetromino.shape;
    currentTetromino.shape = currentTetromino.shape[0].map((_, index) =>
        currentTetromino.shape.map(row => row[index])
    ).reverse();

    if (collision()) {
        currentTetromino.shape = tempShape;
    }
}

function moveTetrominoLeft() {
    currentCol--;
    if (collision()) {
        currentCol++;
    }
}

function moveTetrominoRight() {
    currentCol++;
    if (collision()) {
        currentCol--;
    }
}

function checkForLineClears() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 'empty')) {
            board.splice(r, 1);
            board.unshift(Array(COLUMNS).fill('empty'));
            score += 100;

            if (score >= level * 1000) {
                level++;
                FALL_SPEED = Math.max(100, FALL_SPEED - 50);
            }
        }
    }
}

function gameLoop(timestamp) {
    if (timestamp - lastTime >= FALL_SPEED) {
        lastTime = timestamp;
        timeElapsed++;
        drawBoard();
        drawTetromino();
        drawNextTetromino();
        moveTetromino();
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        gameOverScreen();
    }
}

function gameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', 100, 250);
    ctx.fillText(`Score: ${score}`, 100, 300);
    ctx.fillText('Press R to Restart or L to Leave', 100, 350);
}

function increaseSpeed() {
    setInterval(() => {
        FALL_SPEED = Math.max(100, FALL_SPEED - 50);
    }, 30000); // Erhöhe alle 30 Sekunden die Geschwindigkeit
}

createBoard();
currentTetromino = randomTetromino();
nextTetromino = randomTetromino();
increaseSpeed();
requestAnimationFrame(gameLoop);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveTetrominoLeft();
    }
    if (event.key === 'ArrowRight') {
        moveTetrominoRight();
    }
    if (event.key === 'ArrowDown') {
        moveTetromino();
    }
    if (event.key === 'ArrowUp') {
        rotateTetromino();
    }
    if (event.key === 'r' && gameOver) {
        location.reload();
    }
    if (event.key === 'l' && gameOver) {
        window.location.href = 'Start.html';
    }
});
