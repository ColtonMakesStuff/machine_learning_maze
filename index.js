
const HIT_WALL_REWARD = -50;
const OUT_OF_BOUNDS_REWARD = -100;
const GOAL_REWARD = 1000;

const canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
let isAnimating = true;

c.fillStyle = 'black'; // Set the fill color
c.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle covering the entire canvas

// Cestablishes array that will hold all of the objects in the game
let objects =[]

// get the win counter and parse its current amount to an integer
let pointCounterElement = document.getElementById('pointCounter');
let pointCount = parseInt(pointCounterElement.textContent.split(': ')[1]);
let pointsScoredElement = document.getElementById('pointsScored');
let pointsScored = parseInt(pointCounterElement.textContent.split(': ')[1]);
let gamesPlayedElement = document.getElementById('gamesPlayed');
let gamesPlayed = parseInt(gamesPlayedElement.textContent.split(': ')[1]);
let gameOver = false; // This variable will be used to control the interval
let games = 0;
let score = 0;
// this is the data that will be used to create the maze
// 1 = open
// 2 = dead
// 3 = goal
// 0 = start

let mazeData = [
    [0,1,1,2,1,2,1,1,1,2,1,2,2,1,1,1,1],
    [2,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1],
    [2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,2],
    [2,1,2,2,2,1,2,2,2,2,2,1,2,2,1,1,1],
    [1,1,1,1,2,1,1,1,2,2,1,1,1,1,2,2,2],
    [1,2,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2],
    [1,2,1,1,2,2,1,2,2,1,2,1,2,2,2,1,2],
    [1,1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,2],
    [2,1,2,2,2,2,1,1,2,1,2,1,2,2,2,2,2],
    [2,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,1,2,1,2,1,2,2,2,1,2,2,2,1],
    [2,1,2,2,1,2,1,2,1,2,3,1,1,1,1,1,1],
    [2,1,2,1,1,2,1,2,1,1,2,1,2,2,2,1,2],
    [1,1,2,1,2,2,1,2,2,2,2,1,2,1,2,1,2],
    [1,2,2,1,2,2,1,1,1,1,2,1,2,1,2,1,2],
    [1,1,2,1,1,1,1,2,2,1,1,1,1,1,2,1,2],
]
let easierMazeData = [
    [0,1,1,2,1,2,1,1,1,2,1,2,2,],
    [2,2,1,2,1,2,1,2,1,2,1,2,1,],
    [2,1,1,1,1,1,1,2,1,1,1,1,1,],
    [2,1,2,2,2,1,2,2,2,2,2,1,2,],
    [1,1,1,1,2,1,1,1,2,2,1,1,1,],
    [1,2,1,2,1,1,2,1,1,1,1,2,1,],
    [1,2,1,1,2,2,1,2,2,1,2,1,2,],
    [1,1,2,1,1,1,1,1,2,1,2,1,2,],
    [2,1,2,2,2,2,1,2,2,1,2,1,2,],
    [2,1,1,1,1,2,1,2,1,1,1,1,1,],
    [1,1,2,2,1,2,1,2,1,2,3,2,1,],
    [2,1,2,2,1,2,1,1,1,2,2,1,1,],
]

let largerMazeData = [
    [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]
// i want to be able to make the maze based on a number of rows and columns

// this is the function that will create the maze
function createMazeFromHL(rows, columns) {
    let maze = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(1);
        }
        maze.push(row);
    }
    return maze;
}

let testMaze = createMazeFromHL(17, 17);

// now i need to add the start and goal to the maze at random locations
function addStartAndGoal(maze) {
    let start = {
        x: Math.floor(Math.random() * maze[0].length),
        y: Math.floor(Math.random() * maze.length)
    };
    let goal = {
        x: Math.floor(Math.random() * maze[0].length),
        y: Math.floor(Math.random() * maze.length)
    };
    if (start.x === goal.x && start.y === goal.y) {
        return addStartAndGoal(maze);
    }
    maze[start.y][start.x] = 0;
    maze[goal.y][goal.x] = 3;
    return maze;
}

addStartAndGoal(testMaze);

const addBarriers = (maze) => {
for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
        // Skip 0s and 3s
        if (maze[i][j] === 0 || maze[i][j] === 3) {
            continue;
        }
        // Replace other cells with a 2 with a certain probability
        if (Math.random() <= 0.35) {
            maze[i][j] = 2;
        }
    }
}
return maze;
}

addBarriers(testMaze);


// this is to find the total points possible in the maze
function countElements(mazeData) {
    return mazeData.reduce((total, row) => total + row.length, 0)*10;
}

let totalPoints = countElements(mazeData);

const displayGameBoard = (mazeData) => {

    //
    // Add vertical bars to each row
    mazeData = mazeData.map(row => `|| ${row.join(' ')} ||`);

    // Add horizontal bars and join rows
    let str = ' ' + mazeData.join(' \n ') + ' ';
// now i need to find and replace all 2s in the string with Xs
str = str.replace(/1/g, ' ').replace(/2/g, 'X').replace(/3/g, 'G').replace(/0/g, 'O');


    console.log(`\n ==============================================\n${str}\n =============================================\n`);
}

const adjustScores = () => {
    gamesPlayed += 1;
    gamesPlayedElement.textContent = 'Games Played: ' + (gamesPlayed);
    console.log('test')
    score += gamePiece.pointsPossible;
    pointsScoredElement.textContent = 'Points Scored: ' + (score);
}


//establish the maze class
class Maze {
    constructor({mazeData, c}) {
        this.mazeData = mazeData
        this.squareWidth = c.width/mazeData[0].length
        this.squareHeight = c.height/mazeData.length
        this.gamePieceRadius = (this.squareWidth*.8)/2
        this.gap = this.squareWidth *.16
        this.startPosition = null
        this.goalPosition = null
        this.totalPoints = countElements(mazeData)
    }
    placeholder() {
        console.log(this.mazeData)
        console.log(this.squareWidth)
        console.log(this.squareHeight)
        console.log(this.gap)
        console.log(this.gamePieceRadius)
        console.log(this.totalPoints)
        console.log(this.startPosition)
        console.log(this.goalPosition)
    }
    findGamePieceIndex() {
        for (let i = 0; i < this.mazeData.length; i++) {
            let pieceIndex = this.mazeData[i].indexOf(0);
            if (pieceIndex !== -1) {
                this.startPosition = {
                    x: pieceIndex * this.squareWidth + this.gap / 2,
                    y: i * this.squareHeight + this.gap / 2 
                };
                break;
            }
        }
    }
    findGoalIndex() {
        for (let i = 0; i < this.mazeData.length; i++) {
            let pieceIndex = this.mazeData[i].indexOf(3);
            if (pieceIndex !== -1) {
                this.goalPosition = {
                    x: pieceIndex,
                    y: i 
                };
                break;
            }
        }
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//change the mazeData to the mazeData that you want to use~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let maze  = new Maze({mazeData: easierMazeData, c: canvas})
maze.findGamePieceIndex()
maze.findGoalIndex()
maze.placeholder()


// estableshes the square class
class Square {
    constructor({x, y, color, type, state, width, height }) {
        this.position= {
            x: x,
            y: y
        }
        this.width = width
        this.height = height
        this.type = type
        this.color = color
        this.state = state
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw(); 
     }
}


// estableshes the gamePiece 
class GamePiece {
    constructor({x, y, radius, color, gameMazeData}) {
        this.pointsPossible = totalPoints;
        this.position = {
            x: x,
            y: y
        }
        this.radius = radius;
        this.color = color;
        this.mazeData = gameMazeData.map(row => row.map(item => item));
        this.gamePieceIndex = {
            x: 0,
            y: 0
        }
    }
    findGamePieceIndex() {
        for (let i = 0; i < this.mazeData.length; i++) {
            let pieceIndex = this.mazeData[i].indexOf(0);
            if (pieceIndex !== -1) {
                this.gamePieceIndex = {
                    x: pieceIndex,
                    y: i 
                };
                break;
            }
        }
    }
    findGamepiecePosition() {
        this.position = {
            x: this.gamePieceIndex.x * maze.squareWidth + ((maze.squareWidth) / 2),
            y: this.gamePieceIndex.y * maze.squareHeight  + ((maze.squareHeight) / 2)
        }
    }
    draw() {
        this.findGamepiecePosition()
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }
    // this is the update method that will be called in the animate function
    update() {
        this.draw();
    }
    establishPointsPossible() {
        pointCounterElement.textContent = 'Points Possible: ' + (this.pointsPossible);
    }
    // moves the gamePiece in the direction of the arrow key pressed
    handleGameOver() {
        console.log("game over");
        console.log("you win");
        console.log(`total points: ', ${this.pointsPossible}`)
        adjustScores()
        for (let j = 0; j < objects.length; j++) {
            objects[j].type == 'dead' ? objects[j].color = 'grey' : null;
        }

        //redraw everything in the canvas before stopping the animation so that things are viusally correct
        c.fillStyle = 'black'; // Set the fill color to white
        c.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle covering the entire canvas
        drawObjects()
        gameOver = true;
        isAnimating = false;
    }
 
    moveGamePiece(direction) {
        if (!isAnimating) {
            return;
        }
        this.findGamePieceIndex()
        let tempX = this.gamePieceIndex.x;
        let tempY = this.gamePieceIndex.y;
        if (!isAnimating) {
            return;
        }
        if (direction === 'left') {
            tempX -= 1;
        } else if (direction === 'right') {
            tempX += 1;
        } else if (direction === 'up') {
            tempY -= 1;
        } else if (direction === 'down') {
            tempY += 1;
        } else {
            console.error(`Invalid direction: ${direction}`);
            return;
        }
        let details = this.checkNewIndex(tempX, tempY, direction)
        this.findGamePieceIndex()
        displayGameBoard(this.mazeData);
        return {
            reward: details.reward,
            state: details.state,
            action: details.action
        }

    }
    checkBoundries(x, y) {
        if (x < 0 || x > this.mazeData.length-1 || y < 0 || y > this.mazeData.length-1) {
            console.log('out of bounds')
            return false
        } else { 
            return true 
        }
    }
    handleOutOfBounds(direction, reward, state, action) {
        console.log('out of bounds')
        reward = OUT_OF_BOUNDS_REWARD;
        state = `${this.gamePieceIndex.y},${this.gamePieceIndex.x}`
        action = direction
        return {
            reward: reward,
            state: state,
            action: action
        }
    }
    handleWallCollision(direction, reward, state, action) {
        console.log('hit a wall')
        reward = HIT_WALL_REWARD;
        state = `${this.gamePieceIndex.y},${this.gamePieceIndex.x}`
        action = direction
        this.pointsPossible -= 10;
        return {
            reward: reward,
            state: state,
            action: action
        }
    }
    handleMoveToOpenSpace(x, y, direction, reward, state, action) {
        // now i need to change the value at the new index to 0 and the value at the old index to 1
                reward = 0;
                state = `${y},${x}`
                action = direction
                this.pointsPossible -= 1;
    
        this.mazeData[y][x] = 0;
        this.mazeData[this.gamePieceIndex.y][this.gamePieceIndex.x] = 1;
        this.gamePieceIndex.x = x;
        this.gamePieceIndex.y = y;
    
        for (let j = 0; j < objects.length; j++) {
            if (objects[j].type !== 'start') {
            objects[j].state == state ? objects[j].color = 'limegreen' : null;
        }
    }
        return {
            reward: reward,
            state: state,
            action: action
        }
    
    }
    handleGoalReached(x, y, direction, reward, state, action) {

        reward = GOAL_REWARD;
        state = `${y},${x}`
        action = direction

        this.mazeData[y][x] = 0;
        this.mazeData[this.gamePieceIndex.y][this.gamePieceIndex.x] = 1;
        this.gamePieceIndex.x = x;
        this.gamePieceIndex.y = y;
        let SAR = {
            reward: reward,
            state: state,
            action: action
        }
        this.handleGameOver()
        return SAR
    }
    checkNewIndex(x, y, direction) {
    // i need to find where the new index lands as well as check to see if it is a wall or not

    // lets start by console logging the value at the new index
    let SAR;
    let reward;
    let state;
    let action
    let value;
    if (this.checkBoundries(x, y) === false) {
     SAR = this.handleOutOfBounds(direction, reward, state, action)
     return SAR
    }
    value = this.mazeData[y][x]

    if (value === 2) {
    SAR = this.handleWallCollision(direction, reward, state, action)
    } else if (value === 1) {
    SAR = this.handleMoveToOpenSpace(x, y, direction, reward, state, action)
    } else if (value === 3) {
    SAR = this.handleGoalReached(x, y, direction, reward, state, action)
}
this.establishPointsPossible()

return {
    reward: SAR.reward,
    state: SAR.state,
    action: SAR.action
}
} 
}    
 
 // this is the data that will be used to create the gamePiece
 // the gamePiece will start at the start position
 let gamePieceData = {
   ...maze.startPosition,
   radius: maze.gamePieceRadius,
   color: 'black',
   gameMazeData: maze.mazeData.map(row => row.map(item => item))
 };
 
 let gamePiece;
 
 



//so for each of the squares in the mazeData, we need to create a new square object and push it into the objects array
const OPEN = 1;
const DEAD = 2;
const GOAL = 3;
const START = 0;

const createSquare = (i, j) => {
    let color;
    let type;
    let state = `${i},${j}`;
    let reward;

    switch (maze.mazeData[i][j]) {
        case OPEN:
            color = 'darkgreen';
            type = 'open';
            break;
        case DEAD:
            color = 'red';
            type = 'dead';
            break;
        case GOAL:
            color = 'gold';
            type = 'goal';
            break;
        case START:
            color = 'darkorange';
            type = 'start';
            reward = 0;
            break;
    }

    let newSquare = {
        x: j * maze.squareWidth + maze.gap / 2,
        y: i * maze.squareHeight + maze.gap / 2,
        color: color,
        type: type,
        state: state,
        reward: reward,
        height: maze.squareHeight - maze.gap,
        width: maze.squareWidth- maze.gap
    };

    return new Square(newSquare);
}

const createMaze = () => {
    for (let i = 0; i < maze.mazeData.length; i++) {
        for (let j = 0; j < maze.mazeData[i].length; j++) {
            let square = createSquare(i, j);
            objects.push(square);
        }
    }
}


// this is the function that will draw all of the objects in the objects array
function drawObjects() {
    objects.forEach((object) => {
        if (object instanceof Square || object instanceof GamePiece) {
            object.update();
        }
    });
}


const animate = () => {
    if (!isAnimating) {
        // i need to update the pointsScored element with the points possible
        return;
    }
    window.requestAnimationFrame(animate);
  
    c.fillStyle = 'black'; // Set the fill color to white
    c.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle covering the entire canvas
  
    drawObjects()

  }
  
  window.onload = function() {
    restartGame()
    }
//now i need to listen for keydowns of the arrow keys to be able to move the gamePiece for manual testing

function restartGame() {
    gameOver = true;
    console.log("Restarting game...");
    gameOver = false;
    objects = [];
    createMaze();
    gamePiece = new GamePiece(gamePieceData);
    gamePiece.findGamePieceIndex();
    gamePiece.establishPointsPossible();
    objects.push(gamePiece);
    isAnimating = true;
    displayGameBoard(gamePiece.mazeData);
    animate();
}



// this is the function that will handle the keydown events and move the gamePiece
function handleKeyDown(event) {
    let direction;
    switch (event.key) {
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'Enter':
            restartGame()
            break;
        case 'r':
            sarsa.runMultipleTimes(sarsa.numOfIterations)
            break;
        case 'q':
            gameOver = true;
            break;
        case 's':
        break;
    }
    if (direction) {
       
        let SAR = gamePiece.moveGamePiece(direction)
    
    }
}

// this is the event listener that will listen for the keydown events and call the handleKeyDown function
document.addEventListener('keydown', handleKeyDown);

// i need to switch to having a start neww game button that starts the process of creating a new maze and gamePiece

let newGameButton = document.getElementById('newGameButton')
newGameButton.addEventListener('click', () => {
    restartGame()
})



class Sarsa {
    constructor() {
        this.qTable = {};
        this.alpha = 0.5;
        this.gamma = 0.9;
        this.epsilon = 0.7;
        this.numOfActions = 4;
        this.numOfIterations = 1000;
        this.randomNumber = null;
        this.terminalState = false;
        this.decayRate = 0.9;
        this.maxSteps = 800;
        this.steps = 0;
    }
    printQTable() {
        let output = ' ___________________\n|State | Q-values   |\n|  y x | ▲  ▼  ◄  ► |\n|______|____________|\n';
        for (let state in this.qTable) {
            let roundedQValues = this.qTable[state].map(val => Math.round(val));
            output += `| ${state} | ${roundedQValues.join(', ')} \n`;
        }
        output += '|______|____________|\n';
        console.log(output);
    }
    
    addState(state) {
        this.qTable[state] = Array(this.numOfActions).fill(0);
    }
    checkQTableForState(state) {
        if (!this.qTable[state]) {
            this.addState(state);
        }
    }
    chooseAction(state) {
        this.checkQTableForState(state);
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * this.numOfActions) + 1;
        } else {
            let qValues = this.qTable[state];
            let maxQValue = Math.max(...qValues);
            let bestActions = qValues.reduce((acc, val, idx) => val === maxQValue ? acc.concat(idx) : acc, []);
            return bestActions[Math.floor(Math.random() * bestActions.length)] + 1;
        }
    }
    setSolveInterval() {
        setInterval(() => {
            this.runSarsa();
        }, 100);
    }
    checkTerminalState() {
        if (isAnimating === false) {
        this.terminalState = true;
        }
    }
    runSarsa() {
        // Reset the game state
        // Create a variable to hold the interval ID
        let intervalId;
    
        // Set an interval to run the SARSA algorithm every 0.5 seconds
        intervalId = setInterval(() => {
            this.steps += 1;
            this.checkTerminalState();
            if (this.terminalState === false && this.steps < this.maxSteps) {
                let action;
    
                if (this.randomNumber === null) {
                    this.randomNumber = Math.floor(Math.random() * 4) + 1;  
                }
    
                let currentState = `${gamePiece.gamePieceIndex.y},${gamePiece.gamePieceIndex.x}`
    
                switch (this.randomNumber) {
                    case 1: 
                        action = 'up';
                        break;
                    case 2: 
                        action = 'down';
                        break;
                    case 3: 
                        action = 'left';
                        break;
                    case 4: 
                        action = 'right';
                        break;
                }
    
                let SAR = gamePiece.moveGamePiece(action);
    
                // temp code to choose next action
                this.randomNumber = sarsa.chooseAction(SAR.state)
                let nextAction;
                switch (this.randomNumber) {
                    case 1: 
                        nextAction = 'up';
                        break;
                    case 2: 
                        nextAction = 'down';
                        break;
                    case 3: 
                        nextAction = 'left';
                        break;
                    case 4: 
                        nextAction = 'right';
                        break;
                }
    
                sarsa.checkQTableForState(SAR.state);
                // sarsa.printQTable();
                console.log(this.steps)
                // console.log(this.randomNumber);
                // console.log(`
                //     ~~~~~~~~~~~~~~~~
                //     State1: ${currentState}
                //     Action1: ${SAR.action}
                //     Reward: ${SAR.reward}
                //     State2: ${SAR.state}
                //     Action2: ${nextAction}
                //     ~~~~~~~~~~~~~~~~`);
                sarsa.updateQTable(currentState, SAR.action, SAR.reward, SAR.state, nextAction);
            } else {
                // Stop the interval if the terminal state has been reached
                clearInterval(intervalId);
                this.terminalState = false;
                restartGame()
                this.steps = 0;
            }
        }, 1);
    }
    async runMultipleTimes(iterations) {
        await Promise.all(Array.from({ length: iterations }, async (_, i) => {
            // Reset the game state
            restartGame();
            this.epsilon *= this.decayRate;
            this.epsilon = Math.max(this.epsilon, 0.01); 
            // Run the SARSA algorithm
            this.runSarsa();
    
            // Wait for the SARSA algorithm to finish before starting the next iteration
            await new Promise(resolve => {
                let intervalId = setInterval(() => {
                    if (!this.terminalState) {
                        // Continue waiting
                        return;
                    }
    
                    // Stop waiting and move to the next iteration
                    clearInterval(intervalId);
                    console.log(`Iteration ${i + 1} complete`);
                    resolve();
                }, 1000);
            });
        }));
        this.printQTable();
    }
    
    
    updateQTable(state1, action1, reward, state2, action2) {
    switch (action1) {
        case 'up': action1 = 0; break;
        case 'down': action1 = 1; break;
        case 'left': action1 = 2; break;
        case 'right': action1 = 3; break;
    }
    switch (action2) {
        case 'up': action2 = 0; break;
        case 'down': action2 = 1; break;
        case 'left': action2 = 2; break;
        case 'right': action2 = 3; break;
    }
    console.log(`my state 1 is ${state1}`)
    console.log(`my state 2 is ${state2}`)
    console.log(`my action 1 is ${action1}`)
    console.log(`my action 2 is ${action2}`)
    console.log(`my reward is ${reward}`)
    
    let qValue1 = this.qTable[state1][action1];
    let qValue2 = this.qTable[state2][action2];
    let newQValue = qValue1 + this.alpha * (reward + this.gamma * qValue2 - qValue1);
    this.qTable[state1][action1] = newQValue;
    // this.printQTable();
    }
}

let sarsa = new Sarsa();
sarsa.addState('0,0');
sarsa.addState('0,1');
sarsa.printQTable();


const randomSolver = () => {
    for (let i = 0; i < 100; i++) {
            rollTheDice()
            restartGame()
    }
}



// Q-table
// -------------------------------------
// | State | Up | Down | Left | Right |
// -------------------------------------
// | Cell1 | Q1 | Q2   | Q3   | Q4    |
// | Cell2 | Q5 | Q6   | Q7   | Q8    |
// | ...   | ...| ...  | ...  | ...   |
// -------------------------------------




let intervalId;

let moves = 0;
function gameLoop() {
    if (gameOver) {
        // Clear the interval if the game is over
        restartGame()
    }
    // This function will be called every 2 seconds
    moves += 1;

    // Your game logic goes here...
    rollTheDice()
    
    // Check if the game is over
    if (gameOver) {
        // Clear the interval if the game is over
        restartGame()
    }
}

// Start the game loop
const startSolver = () => {
    intervalId = setInterval(gameLoop, 5);
}

// Somewhere else in your code, you can set gameOver to true to stop the game loop
