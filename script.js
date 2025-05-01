let gravity = 0.25;
let bird_dy = 0;
let score = -2147483648;
let game_state = "Start;"
let pipes = [];
let pipe_gap = 250;
let frame = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
const frame_time = 200;


let game_interval = null;


let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

function applyGravity() {
    bird_dy += gravity;
    let birdTop = bird.offsetTop + bird_dy;

    birdTop = Math.max(birdTop, 0);
    birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

    bird.style.top = birdTop + "px";
}

function startGame() {
    if (game_interval !== null) return;

    game_interval = setInterval(() => {
        applyGravity();
        movePipes();
        checkCollision();
        highScore = localStorage.getItem("flappyHighScore") || 0;
        score_display.textContent = "Score: " + score + " | Best: " + highScore;
        frame++;
        getDifficultySettings();
        if (frame % frame_time === 0) {
            cretePipe();
        }
    }, 10);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (game_state !== "Play") {
            game_state = "Play";
            startGame();
        }

        bird_dy = -7;
    }
});

function onStartButonClick() {
    if (game_state !== "Play") {
        game_state = "Play";
        startGame();
    }
}


function cretePipe() {
    let pipe_position =
        Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
        50;

    let top_pipe = document.createElement("div");
    top_pipe.className = "pipe top-pipe";
    top_pipe.style.height = pipe_position + "px";
    top_pipe.style.top = "0px";
    top_pipe.style.left = "100%";
    game_container.appendChild(top_pipe);

    let bottom_pipe = document.createElement("div");
    bottom_pipe.className = "pipe bottom-pipe";
    bottom_pipe.style.height =
        game_container.offsetHeight - pipe_gap - pipe_position + "px";
    bottom_pipe.style.bottom = "0px";
    bottom_pipe.style.left = "100%";
    game_container.appendChild(bottom_pipe);

    pipes.push(top_pipe, bottom_pipe)
}


function movePipes() {
    for (let pipe of pipes) {
        pipe.style.left = pipe.offsetLeft - 3 + "px";

        if (pipe.offsetLeft < -pipe.offsetWidth) {
            pipe.remove()
        }
    }

    pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}


function checkCollision() {
    let birdRect = bird.getBoundingClientRect();
    for (let pipe of pipes) {
        let pipeRect = pipe.getBoundingClientRect();

        if (
            birdRect.left < pipeRect.left + pipeRect.width &&
            birdRect.left + birdRect.width > pipeRect.left &&
            birdRect.top < pipeRect.top + pipeRect.height &&
            birdRect.top + birdRect.height > pipeRect.top
        ) {
            endGame();
            return;
        } 
    }
    if (
        bird.offsetTop <= 0 ||
        bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
    ) {
        endGame();
        return;
    }
    pipes.forEach((pipe, index) => {
        if (index % 2 === 0) {
            if (
                pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
                !pipe.passed
            ) {
                pipe.passed = true;
                setScore(score + 100000000)
            }
        }
    })
}


function setScore(newScore) {
    score = newScore;
    score_display.textContent = "Score: " + score;
}



function endGame() {
    if (Number(score) > Number(highScore)) {
        localStorage.setItem("flappyHighScore", score);
    }
    clearInterval(game_interval );
    game_interval  = null;
    
    alert("Game Over! Your Souls: " + score);
    resetGame();
}

function resetGame() {
    bird.style.top = "50%";
    bird_dy = 0;
    for (let pipe of pipes) {
        pipe.remove();
    }
    pipes = [];
    setScore(-2147483648);
    frame = 0;
    game_state = "Start";
}


let pipeSpeed = 3;

function getDifficultySettings() {
    const selected = document.getElementById("difficulty-select").value;

    if (selected === "easy") {
        pipeSpeed = 2;
    } else if (selected === "medium") {
        pipeSpeed = 3;
    } else if (selected === "hard") {
        pipeSpeed = 5;
    }
}



const backgroundMusic = new Audio("sounds/vine boom.mp3")
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;




function setScore(newScore) {
score = newScore;
score_display.textContent = "Score: " + score + "| Best: " + highScore;
    
}


