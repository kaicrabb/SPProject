let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//cyborg
let cyborgWidth = 88;
let cyborgHeight = 94;
let cyborgX = 50;
let cyborgY = boardHeight - cyborgHeight;
let cyborgImg;

let cyborg = {
    x : cyborgX,
    y: cyborgY,
    width : cyborgWidth,
    height : cyborgHeight
}

//box
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

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");
    cyborgImg = new Image();
    cyborgImg.src ="./img/cyborg.png";
    cyborgImg.onload = function(){
        context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
    }

    box1Img = new Image();
    box1Img.src = "./img/cactus1.png";

    box2Img = new Image();
    box2Img.src = "./img/cactus2.png";

    box3Img = new Image();
    box3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeBox, 1000); //1000 milliseconds
    document.addEventListener("keydown", moveCyborg);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //cyborg
    velocityY += gravity;
    cyborg.y = Math.min(cyborg.y + velocityY, cyborgY) //apply gravity
    context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);

    //box
    for(let i = 0; i < boxArray.length; i++){
        let box = boxArray[i];
        box.x += velocityX;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if(detectCollision(cyborg, box)){
            gameOver = true;
            cyborgImg.src = "./img/dino-dead.png";
            cyborgImg.onload = function(){
                context.drawImage(cyborgImg, cyborg.x, cyborg.y, cyborg.width, cyborg.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveCyborg(e){
    if(gameOver){
        return;
    }

    if((e.code == "Space" || e.code == "ArrowUp") && cyborg.y == cyborgY){
        //jump
        velocityY = -10;
    }

}

function placeBox(){

    if(gameOver){
        return;
    }

    //place box
    let box = {
        img : null,
        x : boxX,
        Y : boxY,
        width : null,
        height : boxHeight
    }

    let placeBoxChance = Math.random(); //0-0.9999

    if (placeBoxChance > 0.9){
        box.img = box3Img;
        box.width = box3Width;
        boxArray.push(box);
    }
    else if(placeBoxChance > 0.7){
        box.img = box2Img;
        box.width = box2Width;
        boxArray.push(box);
    }
    else if(placeBoxChance > 0.5){
        box.img = box1Img;
        box.width = box1Width;
        boxArray.push(box);
    }

    if(boxArray.length > 5){
        boxArray.shift(); //remove first element from array so doesn't grow

    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}