// Declare board and other game variables
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// cyborg variables
let cyborgWidth = 88;
let cyborgHeight = 94;
let cyborgX = 50;
let cyborgY = boardHeight - cyborgHeight;
let cyborgImg;

let cyborg = {
    x: cyborgX,
    y: cyborgY,
    width: cyborgWidth,
    height: cyborgHeight
};

// Box setup
let boxArray = [];

let box1Width = 34;
let box2Width = 69;
let box3Width = 102;
let boxHeight = 70;
let boxX = 700;
let boxY = boardHeight - boxHeight;

let box1Img;
let box2Img;
let box3Img;

// Physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Setup the game when the page loads
window.onload = function() {
    // Set up the canvas board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load the cyborg image
    cyborgImg = new Image();
    cyborgImg.src = "./img/cyborg.png"; // Ensure the path to your image is correct
    cyborgImg.onload = function() {
        context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
    };

    // Load box images
    box1Img = new Image();
    box1Img.src = "./img/cactus1.png"; // Ensure path is correct

    box2Img = new Image();
    box2Img.src = "./img/cactus2.png"; // Ensure path is correct

    box3Img = new Image();
    box3Img.src = "./img/cactus3.png"; // Ensure path is correct

    // Start the game loop
    requestAnimationFrame(update);
    setInterval(placeBox, 1000); // Spawn a box every second
    document.addEventListener("keydown", moveCyborg); // Add controls
};

// Game update loop
function update() {
    requestAnimationFrame(update); // Keeps the game loop running

    if (gameOver) {
        return;
    }

    // Clear the canvas for the next frame
    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to cyborg
    velocityY += gravity;
    cyborg.y = Math.min(cyborg.y + velocityY, cyborgY); // Apply gravity and prevent falling below ground
    context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);

    // Move and render boxes
    for (let i = 0; i < boxArray.length; i++) {
        let box = boxArray[i];
        box.x += velocityX; // Move box
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        // Check for collisions
        if (detectCollision(cyborg, box)) {
            gameOver = true;
            cyborgImg.src = "./img/cyborg-dead.png"; // Change image when game is over
            cyborgImg.onload = function() {
                context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
            };
        }
    }

    // Render the score
    context.fillStyle = "white";
    context.font = "20px Silkscreen";
    score++;
    context.fillText(score, 5, 20);
}

// Move cyborg (jump when space or up arrow is pressed)
function moveCyborg(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && cyborg.y == cyborgY) {
        // Jump when spacebar or up arrow is pressed
        velocityY = -10;
    }
}

// Spawn new box
function placeBox() {
    if (gameOver) {
        return;
    }

    let box = {
        img: null,
        x: boxX,
        y: boxY,
        width: null,
        height: boxHeight
    };

    // Randomly choose a box type
    let placeBoxChance = Math.random(); // Generates a number between 0 and 1

    if (placeBoxChance > 0.9) {
        box.img = box3Img;
        box.width = box3Width;
        boxArray.push(box);
    } else if (placeBoxChance > 0.7) {
        box.img = box2Img;
        box.width = box2Width;
        boxArray.push(box);
    } else if (placeBoxChance > 0.5) {
        box.img = box1Img;
        box.width = box1Width;
        boxArray.push(box);
    }

    // Limit the number of boxes in the array
    if (boxArray.length > 5) {
        boxArray.shift(); // Remove the oldest box
    }
}

// Collision detection function
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
