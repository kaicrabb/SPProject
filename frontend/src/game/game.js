import React, { useEffect } from 'react'; // Import React and useEffect
import cyborgImgSrc from './img/cyborg.png';
import box1ImgSrc from './img/Crate1.png';
import box2ImgSrc from './img/Crate2.png';
import box3ImgSrc from './img/Crate3.png';
import cyborgDeadImgSrc from './img/cyborg-dead.png';
import backgroundImgSrc from './img/background.png';

function Game() { 
    let token = localStorage.getItem('token');
    console.log(token);

    let board;
    let boardWidth = 750;
    let boardHeight = 250;
    let context;

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

    let boxArray = [];

    let box1Width = 34;
    let box2Width = 69;
    let box3Width = 102;
    let boxHeight = 70;
    let boxX = 700;
    let boxY = boardHeight - boxHeight;

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

    let velocityX = -8;
    let velocityY = 0;
    let gravity = 0.4;

    let gameOver = false;
    let score = 0;
    let scoreSent = false;

    useEffect(() => {
        // Ensure the component has mounted before accessing DOM elements
        const resetButton = document.getElementById("resetButton");
        if (resetButton) {
            resetButton.addEventListener("click", resetGame); // Add the event listener after component mount
        }

        // Set up the canvas board and game logic after the page has loaded
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        board.style.background = `url(${backgroundImgSrc}) no-repeat center center fixed`;
        board.style.backgroundSize = 'cover';
    
        context = board.getContext("2d");
    
        requestAnimationFrame(update);
        setInterval(placeBox, 1000); // Spawn a box every second
        document.addEventListener("keydown", moveCyborg); // Add controls
    }, []); // Empty dependency array to ensure this effect runs once after component mounts

    function update() {
        requestAnimationFrame(update);

        if (gameOver) {
            if (!scoreSent) {
                sendScore(token, score);
                scoreSent = true;
            }
            return;
        }

        context.clearRect(0, 0, board.width, board.height);

        velocityY += gravity;
        cyborg.y = Math.min(cyborg.y + velocityY, cyborgY);
        context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);

        for (let i = 0; i < boxArray.length; i++) {
            let box = boxArray[i];
            box.x += velocityX;
            context.drawImage(box.img, box.x, box.y, box.width, box.height);

            if (detectCollision(cyborg, box)) {
                gameOver = true;
                cyborgImg.src = cyborgDeadImgSrc;
                cyborgImg.onload = function() {
                    context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
                };
            }
        }

        context.fillStyle = "white";
        context.font = "20px Silkscreen";
        score++;
        context.fillText(score, 5, 20);
    }

    function moveCyborg(e) {
        if (gameOver) {
            return;
        }

        if ((e.code === "Space" || e.code === "ArrowUp") && cyborg.y === cyborgY) {
            velocityY = -10;
        }
    }

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

        let placeBoxChance = Math.random();

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

        if (boxArray.length > 5) {
            boxArray.shift();
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    async function sendScore(token, score) {
        try {
            const response = await fetch('http://localhost:3000/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ score }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                throw new Error('Failed to submit score.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function resetGame() {
        gameOver = false;
        score = 0;
        scoreSent = false;
        velocityY = 0;
        velocityX = -8;
        cyborg.y = cyborgY;
        cyborgImg.src = cyborgImgSrc;
        boxArray = [];

        context.clearRect(0, 0, board.width, board.height);
        context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
    }

    return (
        <div style={styles.gameWrapper}>
            <div style={styles.canvasWrapper}>
                <canvas id="board" style={styles.canvas}></canvas>
                <img
                    src="Reset.png"
                    alt="Reset"
                    style={styles.resetButton}
                    id="resetButton" // Add id to the button element
                />
            </div>
        </div>
    );
    
};
const styles = {
    gameWrapper: {
        display: 'flex',
        justifyContent: 'center',  // Horizontally center the wrapper
        alignItems: 'center',      // Vertically center the wrapper
        height: '100vh',           // Full viewport height
        backgroundColor: 'black', // Background color for the game screen
    },
    canvasWrapper: {
        position: 'relative',  // Allows positioning of the button inside the canvas container
    },
    canvas: {
        display: 'block',      // Removes unwanted space below the canvas
        border: '2px solid black',  // Optional: Adds a border to the canvas for visibility
    },
    resetButton: {
        position: 'absolute',   // Position relative to the canvas container
        bottom: '300px',            // Adjust top margin
        right: '0px',          // Adjust right margin
        width: '32px',          // Set width for the button
        height: '32px',         // Set height for the button
        cursor: 'pointer',     // Changes cursor to pointer to indicate it's clickable
    }
};

export default Game;
