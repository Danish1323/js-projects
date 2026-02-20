const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const startBtn = document.querySelector('#start-btn');

let score = 0;
let currentTime = 30;
let moleTimer = null;
let countDownTimer = null;
let hitPosition = null;

function randomHole() {
    // Remove mole class from all holes first
    holes.forEach(hole => hole.classList.remove('mole'));

    // Pick a random hole
    let randomIdx = Math.floor(Math.random() * 9);
    let hole = holes[randomIdx];

    hole.classList.add('mole');
    hitPosition = hole.id;
}

// Logic for clicking a hole
holes.forEach(hole => {
    hole.addEventListener('mousedown', () => {
        if (hole.id === hitPosition) {
            score++;
            scoreDisplay.textContent = score;
            hitPosition = null; // Prevent double clicking same mole
            hole.classList.remove('mole');
        }
    });
});

function moveMole() {
    moleTimer = setInterval(randomHole, 700); // Speed of mole (700ms)
}

function countDown() {
    currentTime--;
    timeDisplay.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(countDownTimer);
        clearInterval(moleTimer);
        alert('GAME OVER! Your final score is ' + score);
        resetGame();
    }
}

function startGame() {
    resetGame();
    moveMole();
    countDownTimer = setInterval(countDown, 1000);
}

function resetGame() {
    clearInterval(moleTimer);
    clearInterval(countDownTimer);
    score = 0;
    currentTime = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = currentTime;
    holes.forEach(hole => hole.classList.remove('mole'));
}

startBtn.addEventListener('click', startGame);