import React, { useEffect, useState, useRef } from 'react';
import { getCharacterImages } from './fetch_character'; // get character images
import box1ImgSrc from './img/Crate1.png'; // import box image
import box2ImgSrc from './img/Crate2.png'; // import box image
import box3ImgSrc from './img/Crate3.png'; // import box image
import backgroundImgSrc from './img/background.png'; // import background

function Game() {
  const [cyborgImgSrc, setCyborgImgSrc] = useState(null);
  const [cyborgDeadImgSrc, setCyborgDeadImgSrc] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const token = localStorage.getItem('token');

  // Game variables stored in refs
  const boardRef = useRef(null);
  const contextRef = useRef(null);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const boxArrayRef = useRef([]);
  const cyborgRef = useRef({ x: 50, y: 156, width: 88, height: 94 });

  const [cyborgImg, setCyborgImg] = useState(new Image());
  const [cyborgDeadImg, setCyborgDeadImg] = useState(new Image());
  const velocityRef = useRef({ x: -8, y: 0 });
  const gravity = 0.4;
  let scoreSent = false;
  let score = 0;

  // Get the character images before doing anything else
  useEffect(() => { 
    async function fetchCharacter() {
      try { // try to get the images
        const { cyborgImgSrc, cyborgDeadImgSrc } = await getCharacterImages(token);
        setCyborgImgSrc(cyborgImgSrc);
        setCyborgDeadImgSrc(cyborgDeadImgSrc);
      } catch (error) { // catch errors
        console.error('Error fetching character images:', error);
      }
    }
    fetchCharacter();
  }, [token]);

  // Make sure Player images are loaded
  useEffect(() => {
    if (cyborgImgSrc && cyborgDeadImgSrc) { // once we have images
      const img = new Image(); // set up img variable
      const deadImg = new Image(); // set up deadImg variable
      let loadedImages = 0; // loaded images variable

      const checkAllLoaded = () => { // function that checks if both images have loaded
        loadedImages++;
        if (loadedImages === 2) setImagesLoaded(true);
      };

      img.onload = checkAllLoaded; // load img
      deadImg.onload = checkAllLoaded; // load deadImg

      img.src = cyborgImgSrc; // set img to be main player image
      deadImg.src = cyborgDeadImgSrc; // set deadImg to be dead player image

      setCyborgImg(img);
      setCyborgDeadImg(deadImg);
    }
  }, [cyborgImgSrc, cyborgDeadImgSrc]);

  // Set up board for the game
  useEffect(() => {
    if (imagesLoaded) { // once images have loaded continue
      const board = document.getElementById('board'); // set up board element
      board.height = 250; // set its height
      board.width = 750; // set its width
      board.style.background = `url(${backgroundImgSrc}) no-repeat center center fixed`; // set background
      board.style.backgroundSize = 'cover';

      const context = board.getContext('2d');
      boardRef.current = board;
      contextRef.current = context;

      const handleKeyDown = (e) => moveCyborg(e);
      document.addEventListener('keydown', handleKeyDown);

      const interval = setInterval(placeBox, 1000);
      requestAnimationFrame(update);

      return () => {
        clearInterval(interval);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [imagesLoaded]);

  function update() {
    if (!imagesLoaded || gameOverRef.current) return;
    const context = contextRef.current;
    const cyborg = cyborgRef.current;
    const velocity = velocityRef.current;

    context.clearRect(0, 0, 750, 250);
    velocity.y += gravity;
    cyborg.y = Math.min(cyborg.y + velocity.y, 156);

    context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);

    boxArrayRef.current = boxArrayRef.current.filter((box) => box.x + box.width > 0);
    boxArrayRef.current.forEach((box) => {
      box.x += velocity.x;
      context.drawImage(box.img, box.x, box.y, box.width, box.height);

      if (detectCollision(cyborg, box)) {
        gameOverRef.current = true;
        // Draw the dead version without altering the cyborgImg.src permanently
        context.drawImage(cyborgDeadImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
        if (!scoreSent) {
          sendScore(token, score+1);
          scoreSent = true;
          console.log ("sending score: ", score+1);
        }
        return; // Stop further updates after a collision
      }
    });

    scoreRef.current++;
    score++;
    context.fillStyle = 'white';
    context.font = '20px Silkscreen';
    context.fillText(scoreRef.current, 5, 20);

    requestAnimationFrame(update);
  }

  function moveCyborg(e) {
    if (gameOverRef.current) return;
    if ((e.code === 'Space' || e.code === 'ArrowUp') && cyborgRef.current.y === 156) {
      velocityRef.current.y = -10;
    }
  }

  function placeBox() {
    if (gameOverRef.current) return;

    const random = Math.random();
    const box = {
      img: new Image(),
      x: 750,
      y: 180,
      width: 34,
      height: 70,
    };

    if (random > 0.9) {
      box.img.src = box3ImgSrc;
      box.width = 102;
    } else if (random > 0.7) {
      box.img.src = box2ImgSrc;
      box.width = 69;
    } else {
      box.img.src = box1ImgSrc;
      box.width = 34;
    }

    boxArrayRef.current.push(box);
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

  function resetGame() {
    
    gameOverRef.current = false;
    scoreRef.current = 0;
    velocityRef.current = { x: -8, y: 0 };
    cyborgRef.current.y = 156; // Reset cyborg to ground position
    boxArrayRef.current = []; // Clear all obstacles

    // Reset to alive image
    const img = new Image();
    img.src = cyborgImgSrc;
    img.onload = () => {
      setCyborgImg(img); // Ensure cyborgImg is reset to the alive version
    };

    // Clear and reset the canvas
    const context = contextRef.current;
    context.clearRect(0, 0, 750, 250); // Clear the canvas
    context.drawImage(img, cyborgRef.current.x, cyborgRef.current.y, cyborgRef.current.width, cyborgRef.current.height);

    // Restart the game loop
    requestAnimationFrame(update);
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  return (
    <div style={styles.gameWrapper}>
      <div style={styles.canvasWrapper}>
        <canvas id="board" style={styles.canvas}></canvas>
        <img
          id="resetButton"
          src="/Reset.png"
          alt="Reset"
          style={styles.resetButton}
          onClick={resetGame}
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
