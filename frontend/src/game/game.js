// Import images at the top
import cyborgImgSrc from './img/cyborg.png';
import box1ImgSrc from './img/Crate1.png';
import box2ImgSrc from './img/Crate2.png';
import box3ImgSrc from './img/Crate3.png';
import cyborgDeadImgSrc from './img/cyborg-dead.png';
import backgroundImgSrc from './img/background.png';

function Game() { 
    //get users token from logging in
    let token = localStorage.getItem('token');
    console.log(token);

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

    // Load the cyborg and box images as Image objects
    let cyborgImg = new Image();
    cyborgImg.src = cyborgImgSrc;

    let box1Img = new Image();
    box1Img.src = box1ImgSrc;

    let box2Img = new Image();
    box2Img.src = box2ImgSrc;

    let box3Img = new Image();
    box3Img.src = box3ImgSrc;

    let cyborgDeadImg = new Image();
    cyborgDeadImg.src = cyborgDeadImgSrc;

    let backgroundImg = new Image();
    backgroundImg.src = backgroundImgSrc;

    // Physics
    let velocityX = -8;
    let velocityY = 0;
    let gravity = 0.4;

    let gameOver = false;
    let score = 0;
    let scoreSent = false;

    // Setup the game when the page loads
    window.onload = function() {
        // Set up the canvas board
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;

        // Set the background image through JS
        board.style.background = `url(${backgroundImgSrc}) no-repeat center center fixed`;
        board.style.backgroundSize = 'cover';

        context = board.getContext("2d");

        // Start the game loop
        requestAnimationFrame(update);
        setInterval(placeBox, 1000); // Spawn a box every second
        document.addEventListener("keydown", moveCyborg); // Add controls
    };

    // Game update loop
    function update() {
        requestAnimationFrame(update); // Keeps the game loop running

        if (gameOver) {
            if (!scoreSent) {
                sendScore(token, score); // Send the score to the server if not already sent
                scoreSent = true;
            }
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
                cyborgImg.src = cyborgDeadImgSrc; // Change image when game is over
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

        if ((e.code === "Space" || e.code === "ArrowUp") && cyborg.y === cyborgY) {
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
    
    async function sendScore(token, score) {
        console.log("sending score");
        try {
            const response = await fetch('http://localhost:3000/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                },
                body: JSON.stringify({ score }), // Send score in the request body
                
            });
            console.log("score sent");
            if (response.ok) {
                const data = await response.json(); // Wait for the response and parse it
                console.log(data.message); // Handle success message from the server
                console.log("Response given");
            } else {
                throw new Error('Failed to submit score.'); // Throw error if response is not ok
            }
        } catch (error) {
            console.error('Error:', error); // Handle any error that occurred during fetch
        }
    }
}

export default Game;
