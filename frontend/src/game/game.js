import React, { useEffect, useState } from 'react';
import { getCharacterImages } from './fetch_character'; // Assumed fetch function for images

import box1ImgSrc from './img/Crate1.png';
import box2ImgSrc from './img/Crate2.png';
import box3ImgSrc from './img/Crate3.png';
import backgroundImgSrc from './img/background.png';

function Game() {
  const [cyborgImgSrc, setCyborgImgSrc] = useState(null);
  const [cyborgDeadImgSrc, setCyborgDeadImgSrc] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const token = localStorage.getItem('token');

  // Initialize game variables
  const boardWidth = 750;
  const boardHeight = 250;
  let board;
  let context;

  const cyborgWidth = 88;
  const cyborgHeight = 94;
  const cyborgX = 50;
  const cyborgY = boardHeight - cyborgHeight;

  let cyborg = { x: cyborgX, y: cyborgY, width: cyborgWidth, height: cyborgHeight };

  let boxArray = [];
  const box1Width = 34;
  const box2Width = 69;
  const box3Width = 102;
  const boxHeight = 70;
  const boxX = 700;
  const boxY = boardHeight - boxHeight;

  let velocityX = -8;
  let velocityY = 0;
  const gravity = 0.4;

  let gameOver = false;
  let score = 0;
  let scoreSent = false;

  let cyborgImg = new Image();
  let cyborgDeadImg = new Image();
  let box1Img = new Image();
  let box2Img = new Image();
  let box3Img = new Image();
  let backgroundImg = new Image();

  // Load static images
  box1Img.src = box1ImgSrc;
  box2Img.src = box2ImgSrc;
  box3Img.src = box3ImgSrc;
  backgroundImg.src = backgroundImgSrc;

  // Fetch character images from the backend
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const { cyborgImgSrc, cyborgDeadImgSrc } = await getCharacterImages(token);
        setCyborgImgSrc(cyborgImgSrc);
        setCyborgDeadImgSrc(cyborgDeadImgSrc);
      } catch (error) {
        console.error('Error fetching character images:', error);
      }
    }

    fetchCharacter();
  }, [token]);

  // Load images once character images are fetched
  useEffect(() => {
    if (cyborgImgSrc && cyborgDeadImgSrc) {
      cyborgImg.src = cyborgImgSrc;
      cyborgDeadImg.src = cyborgDeadImgSrc;

      // Ensure both images are loaded before starting the game loop
      let loadedImages = 0;

      cyborgImg.onload = () => {
        loadedImages++;
        if (loadedImages === 2) {
          setImagesLoaded(true);
        }
      };

      cyborgDeadImg.onload = () => {
        loadedImages++;
        if (loadedImages === 2) {
          setImagesLoaded(true);
        }
      };
    }
  }, [cyborgImgSrc, cyborgDeadImgSrc]);

  // Setup board and background once images are loaded
  useEffect(() => {
    if (imagesLoaded) {
      board = document.getElementById('board');
      board.height = boardHeight;
      board.width = boardWidth;
      board.style.background = `url(${backgroundImgSrc}) no-repeat center center fixed`;
      board.style.backgroundSize = 'cover';

      context = board.getContext('2d');
      requestAnimationFrame(update);
      setInterval(placeBox, 1000);
      document.addEventListener('keydown', moveCyborg);
    }
  }, [imagesLoaded]);

  // Update game frame
  function update() {
    if (!imagesLoaded) return;
    requestAnimationFrame(update);

    if (gameOver) {
      if (!scoreSent) {
        sendScore(token, score);
        scoreSent = true;
      }
      return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);
    velocityY += gravity;
    cyborg.y = Math.min(cyborg.y + velocityY, cyborgY);
    
    // Draw the cyborg image (ensure it's loaded before drawing)
    if (cyborgImg.complete) {
      context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
    } else {
      // In case the image hasn't fully loaded
      console.log("Image not loaded yet");
    }

    for (let i = 0; i < boxArray.length; i++) {
      let box = boxArray[i];
      box.x += velocityX;
      context.drawImage(box.img, box.x, box.y, box.width, box.height);

      if (detectCollision(cyborg, box)) {
        gameOver = true;
        cyborgImg.src = cyborgDeadImgSrc;
        cyborgImg.onload = function () {
          context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
        };
      }
    }

    context.fillStyle = 'white';
    context.font = '20px Silkscreen';
    score++;
    context.fillText(score, 5, 20);
  }

  // Move cyborg on key press
  function moveCyborg(e) {
    if (gameOver) return;
    if ((e.code === 'Space' || e.code === 'ArrowUp') && cyborg.y === cyborgY) {
      velocityY = -10;
    }
  }

  // Place new box on the screen
  function placeBox() {
    if (gameOver) return;

    let box = { img: null, x: boxX, y: boxY, width: null, height: boxHeight };
    let placeBoxChance = Math.random();

    if (placeBoxChance > 0.9) {
      box.img = box3Img;
      box.width = box3Width;
    } else if (placeBoxChance > 0.7) {
      box.img = box2Img;
      box.width = box2Width;
    } else if (placeBoxChance > 0.5) {
      box.img = box1Img;
      box.width = box1Width;
    }

    if (box.img) {
      boxArray.push(box);
    }

    if (boxArray.length > 5) {
      boxArray.shift();
    }
  }

  // Detect collision between cyborg and box
  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // Send score to backend
  async function sendScore(token, score) {
    try {
      const response = await fetch('http://localhost:3000/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit score.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }

  // Reset the game state
  function resetGame() {
    gameOver = false;
    score = 0;
    scoreSent = false;
    velocityY = 0;
    velocityX = -8;
    cyborg.y = cyborgY;
    cyborgImg.src = cyborgImgSrc;
    cyborgDeadImg.src = cyborgDeadImgSrc; // Reset dead image source
    boxArray = [];

    // Ensure board context is reset and new game state is drawn
    if (context) {
      context.clearRect(0, 0, boardWidth, boardHeight);
      context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
    }
  }

  useEffect(() => {
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.addEventListener('click', resetGame);
    }
    return () => {
      if (resetButton) {
        resetButton.removeEventListener('click', resetGame);
      }
    };
  }, []);

  return (
    <div style={styles.gameWrapper}>
      <div style={styles.canvasWrapper}>
        <canvas id="board" style={styles.canvas}></canvas>
        <img
  id="resetButton"
  src="/Reset.png"
  alt="Reset"
  style={styles.resetButton}
/>
      </div>
    </div>
  );
}

const styles = {
  gameWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#222',
  },
  canvasWrapper: {
    position: 'relative',
    border: '1px solid white',
  },
  canvas: {
    border: '2px solid white',
  },
  resetButton: {
    backgroundColor: 'transparent',
    border: 'none',
    position: 'absolute',
    bottom: '0px',
    right: '10px',
    height: '25px',
    width: '25px',
    cursor: 'pointer',
  },
};

export default Game;
