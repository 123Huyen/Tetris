//step 1, draw the board of canvas
const gridWidth = 12;
const gridHeight = 22;
const blockSize = 30;
const canvasWidth = gridWidth * blockSize;
const canvasHeight = gridHeight * blockSize;
const canvasLeft = 50;
const canvasTop = 30;
 
let canvas;
let context;

window.onload = function() {
    canvas = document.getElementById("GameCanvas");
    context = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.left = canvasLeft + "px";
    canvas.style.top = canvasTop + "px";

    window.requestAnimationFrame(loop);
    intervalId = setInterval(dropBlock,blockDropInterval);
    document.addEventListener("keydown", onKeyDown);
};

function loop (timestamp) {
    onDraw();
    window.requestAnimationFrame(loop);
}

function onDraw () {
    //background coloring
    context.fillStyle = "#EADDCA";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    //border coloring
    context.strokeStyle = "white";
    context.lineWidth = 3;
    for (let y = 0; y< gridHeight; y++) {
        for (let x =0; x<gridWidth; x++) {
            context.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
        }
    }
    //draw fixed block
    drawFixBlocks();
    //draw current block
    drawCurrentBlock();
    //draw next block
    drawNextBlock()
}

// step 2, create 2d field (22 rows, 12 column)
let field = [
    [1,1,1,1,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
];
// function of coloring block
function drawFixBlocks () {
    for (let y = 0; y < field.length; y++) {
        for (let x =0; x<field[y].length; x++) {
            if (field[y][x]===1){
                drawSingleBlock(x,y,color)
            }
        }
    }
}

function drawSingleBlock (x,y,color){
    context.fillStyle = color;
    context.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
    context.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
}

// step 3, define block's position and color 
let currentX = 4;
let currentY = 0;
let currentColor = "#ff0000"
let currentDropInterval = blockDropInterval;

let currentBlock = 0;
let currentOrientation = 0;
let block = blocks[currentBlock][currentOrientation];
//draw block
function drawCurrentBlock () {
    for (let y=0; y < block.length; y++){
        for (let x=0; x < block[y].length; x++) {
            if (block[y][x]===1){
                drawSingleBlock(currentX, currentY, currentColor);
            }
        }
    }
}

//step 4, block drop interval
const blockDropInterval = 1000;

function isBottom () {
    return currentY === gridHeight - 1|| field[currentY+1][currentX]!==0;
}
 // Step 5, when current block reaches to the bottom, add new block to drop into canvas
function createNewBlock() {
    currentBlock = nextBlock === null? Math.floor(Math.random()*blocks,length): nextBlock;
    currentOrientation = 0;
    currentX = Math.floor((gridWidth - blocks[currentBlock][currentOrientation][0].length) /2 );
    currentY = 0;
    currentColor = colors[currentBlock]; 

    nextBlock = Math.floor(Math.random()*blocks.length);

    currentDropInterval -=10;
    if (currentDropInterval < 100) {
        currentDropInterval = 100
    }

    if(!isCollided(currentX, currentY, currentOrientation)) {
        gameOver();
    }else {
        intervalId = setInterval(dropBlock, currentDropInterval);
    }
}
function  drawNextBlock() {
    const nextBlockWidth = 100;
    const nextBlockHeight = 100;
    const nextBlockX = canvasWidth + 50;
    const nextBlockY = 50;

    context.fillStyle="rgba(255, 255, 255, 0.7)";
    context.fillRect(nextBlockX, nextBlockY, nextBlockWidth, nextBlockHeight);

    const block = blocks[nextBlock][0];
    const blockWidth = nextBlockWidth/block[0].length;
    const blockHeight = nextBlockHeight / block.length;
    const blockX = nextBlockX + (nextBlockWidth - blockWidth*block[0].length)/2;
    const blockY = nextBlockY + (nextBlockHeight - blockHeight*block.length) /2;

    for (let y=0; y< block.length; y++){
        for (let x=0; x<block[y].length; x++) {
            if (block[y][x] === 1){
                context.fillStyle = colors[nextBlock];
                context.fillRect(blockX + x*blockWidth, blockY + y*blockHeight, blockWidth, blockHeight);
                context.strokeStyle = "black";
                context.strokeRect(blockX+x*blockWidth, blockY + y*blockHeight, blockWidth, blockHeight);
                }
            }
        }
} 

//step 6, add keyboard controller
document.addEventListener("keydown", onKeyDown);

function onKeyDown (event) {
    switch (event.keyCode) {
        case 37: //left arrow
            moveLeft();
            break;
        case 39: //right arrow
            moveRight();
            break;
        case 40: //down arrow
            dropBlock();
            break;
        case 32: //space key
            if (intervalId === null) {
                resetGame();
            }else {
                rotate();
                }
            break;
    }
}

function moveLeft() {
    if (!isCollided(currentX-1, currentY)) {
        currentX--;
    }
}
function moveRight() {
    if(!isCollided(currentX+1,currentY )) {
        currentX++;
    }
}

function rotate() {
    let nextOrientation = (currentOrientation +1) % blocks[currentBlock].length;
    if (!isCollided(currentX, currentY, nextOrientation)) {
        currentOrientation = nextOrientation;
    }
}

// function for dropping block
function dropBlock () {
    if(!isCollided(currentX, currentY+1)){
    currentY++;
    }
    else{
        for (let i =0; i<block.length; i++) {
            for (let j=0; j < block[i].length; j++) {
                if (block[i][j] === 1) {
                    field[currentX + i][currentY + j] = 2;
                }
            }
        }
        clearInterval(intervalId);
        createNewBlock();
        clearLines();
    }
}

//step 7, delete the complete bottom row
function clearLines () {
    for (let y=gridHeight - 1; y >= 0; y--) {
        if (isLineFull(y)) {
            clearLine(y);
            dropLines(y);
            y++;
        }
    }
}

function isLineFull(y) {
    for (let x=0; x < gridWidth; x++) {
        if(field[y][x]===0){
            return false;
        }
    }
    return true;
}

function dropLines(startY) {
    for(let y = startY; y>0; y--){
        for (let x=0; x< gridWidth;x++){
            field[y][x]=field[y-1][x];
        }
    }
}
//step 8, speed dropping up (updated on exist function)
/**currentDropInterval -=10;
if (currentDropInterval < 100) {
    currentDropInterval = 100
}
function createNewBlock() {
    currentX = 4;
    currentY = 0;
    currentColor = "rgb(255, 0, 0)"; 

    currentDropInterval -=10;
    if (currentDropInterval < 100) {
        currentDropInterval = 100
    }

    intervalId = setInterval(dropBlock, currentDropInterval);
}

**/
 
// step 9, make a falling block into a mass of multiple block
const blocks = [
   [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    [[1,0,0],[1,1,1],[0,0,1]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
    [[1,1],[1,1]],
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
    [[1,1,0],[0,1,1]],
    [[0,0,1],[0,1,1],[0,1,0]]
    ]
];

function isCollided (x,y, orientation) {
    for (let i = 0; i<block.length; i++) {
        for (let j=0; j < block[i].length; j++) {
            if (block[i][j]===1) {
                let fieldX = x+j;
                let fieldY = y+i;
                if (fieldX<0||fieldX >= gridWidth || fieldY >= gridHeight||field[fieldY][fieldX]!==0){
                    return true;
                }
            }
        }
    }
    return false;
}
//step 10, block rotating
/*case 32: //space key
             rotate();
             break;

function rotate() {
    let nextOrientation = (currentOrientation +1) % blocks[currentBlock].length;
    if (!isCollided(currentX, currentY, nextOrientation)) {
        currentOrientation = nextOrientation;
    }
}*/

//step 11, add blocks' type and color
const colors = [
    "#C9CC3F",
    "#5F8575",
    "#6082B6",
    "#A0522D",
    "#7C3030",
    "#4682B4",
    "#0437F2",
    "#5D3FD3",
    "#966919",
    "#913831"
];

function gameOver() {
    clearInterval(intervalId);
    showGameOverMessage();
}

function showGameOverMessage () {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("ゲーム オーバー", canvasWidth /2, canvasHeight/2);
    context.fillText("スペースを押して再開しましょう！", canvasWidth/2, canvasHeight/2 + 40);
}

function resetGame() {
    field = [
        [1,1,1,1,0,0,0,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    currentDropInterval = blockDropInterval;
    createNewBlock();
}
// step 13,
let nextBlock = null;




