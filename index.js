
let canvas = document.getElementById('myCanvas');
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

let games = 0;
let score = 0;
// this is the data that will be used to create the maze
// 1 = open
// 2 = dead
// 3 = goal
// 0 = start

let mazeData = [
    [0,1,1,1,1,1,1,1,1],
    [2,2,1,1,1,2,1,1,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,1,1,1,1],
    [1,1,1,1,2,1,1,1,2],
    [1,2,1,1,1,1,1,1,1],
    [1,2,1,1,2,2,3,2,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,1,2,2,2,1,1,1],
]

// i need to change the mazeData to have a square hight and width variable based on the canvas size and the number of squares in the mazeData
let squareWidth = canvas.width / mazeData[0].length;
let squareHeight = canvas.height / mazeData.length; 
let gap = squareWidth / 10;
// this is to find the total points possible in the maze
function countElements(mazeData) {
    return mazeData.reduce((total, row) => total + row.length, 0)*10;
}

let totalPoints = countElements(mazeData);


const adjustScores = () => {
    gamesPlayed += 1;
    gamesPlayedElement.textContent = 'Games Played: ' + (gamesPlayed);
    console.log('test')
    score += gamePiece.pointsPossible;
    pointsScoredElement.textContent = 'Points Scored: ' + (score);
}


// estableshes the square class
class Square {
    constructor({x, y, color, type, state, reward, width, height }) {
        this.position= {
            x: x,
            y: y
        }
        this.width = width
        this.height = height
        this.type = type
        this.color = color
        this.state = state
        this.reward = reward
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw(); 
     }
}

// this is a test square to make sure the square class is working
let gameSquare = {
    x: 5,
    y: 5,
    color: 'green',
    type: 'open'
}

// estableshes the gamePiece 
class GamePiece {
    constructor({x, y, radius, color}) {
        this.pointsPossible = totalPoints;
        this.position = {
            x: x,
            y: y
        }
        this.radius = radius;
        this.color = color;
    }
    draw() {
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

                isAnimating = false;
    }
    calculateNewPosition(direction) {
        let newX = this.position.x;
        let newY = this.position.y;
        switch (direction) {
            case 'left':
                newX -= 100;
                break;
            case 'right':
                newX += 100;
                break;
            case 'up':
                newY -= 100;
                break;
            case 'down':
                newY += 100;
                break;
            default:
                console.error(`Invalid direction: ${direction}`);
                return;
        }
        if (!isAnimating) {
            return;
        }
    
    return {x: newX, y: newY}
    }
    move(direction) {
        if (!isAnimating) {
            return;
        }
        let newX = this.calculateNewPosition(direction).x;
        let newY = this.calculateNewPosition(direction).y;
        let state;
        let reward = -5;
        let moved = false;
        let type;

        if ((newX >= 50 && newX <= 850) && (newY >= 50 && newY <= 850)) {

            type = this.checkBeforeMove(direction).type;
            reward = this.checkBeforeMove(direction).reward;
            state = this.checkBeforeMove(direction).state;
            moved = this.checkBeforeMove(direction).moved;
    
            // console.log(`state: ${state}`)
            // console.log(`reward: ${reward}`)
            // console.log(`moved: ${moved}`)
            // console.log(`type: ${type}`)
            //     // console.log(checks)
    

            if (type === 'dead') {
                this.pointsPossible -= 10;
            } else if (type === 'goal') {
                this.position.x = newX;
                this.position.y = newY;
                this.handleGameOver()
            } else {
                this.pointsPossible -= 1;
                this.position.x = newX;
                this.position.y = newY;
            }
        }
        // console.log(`points possible: ${this.pointsPossible}`)
        pointCounterElement.textContent = 'Points Possible: ' + (this.pointsPossible);
        return {
            state: state,
            reward: reward,
            moved: moved
        };
    }
    
    checkBeforeMove( direction ) {
        // this is the code that will determine the potential position of the gamePiece based on the direction
        let potentialPosition;
        direction === 'left' ? potentialPosition = {x: this.position.x - 100, y: this.position.y} : 
        direction === 'right' ? potentialPosition = {x: this.position.x + 100, y: this.position.y} :
        direction === 'up' ? potentialPosition = {x: this.position.x, y: this.position.y - 100} :
        potentialPosition = {x: this.position.x, y: this.position.y + 100}
        let moved = false;

        // this is the code that will check the objects array to see if the potential position is open, goal, or start
        for (let i = 0; i < objects.length; i++) {
            if (potentialPosition.x - 45 === objects[i].position.x && potentialPosition.y - 45 === objects[i].position.y) {
                // i need to check the goals type reward and state
//                 console.log(`
// type: ${objects[i].type}
// reward: ${objects[i].reward}
// state: ${objects[i].state}

// `)
                if (objects[i].type === 'dead') {

                    return {type: 'dead', reward: objects[i].reward, state: objects[i].state, moved: moved}
                } else if (objects[i].type === 'goal' ){
                    moved = true;
                   return {type: 'goal', reward: objects[i].reward, state: objects[i].state, moved: moved}
                } else if  (objects[i].type === 'start'){
                    moved = true;
                    return {type: 'start', reward: objects[i].reward, state: objects[i].state, moved: moved}
                } else {
                    moved = true;
                    objects[i].color = 'limegreen';
                    return {type: 'open', reward: objects[i].reward, state: objects[i].state, moved: moved}
                }
            }
        }
    }
}    
 
 let startPosition;

 // this is the code that will find the start position of the gamePiece based on the position in the maze and set it to the startPosition variable
 for (let i = 0; i < mazeData.length; i++) {
    let startIndex = mazeData[i].indexOf(0);
    if (startIndex !== -1) {
        startPosition = {
            x: startIndex * 100 + 50,
            y: i * 100 + 50
        };
        break;
    }
 }
 
 // this is the data that will be used to create the gamePiece
 // the gamePiece will start at the start position
 let gamePieceData = {
   ...startPosition,
   radius: 40,
   color: 'purple'
 };
 
 let gamePiece;
 
 



//so for each of the squares in the mazeData, we need to create a new square object and push it into the objects array
const createMaze = () => {
    for (let i = 0; i < mazeData.length; i++) {
        for (let j = 0; j < mazeData[i].length; j++) {
            let color;
            let type;
            let state = `${i},${j}`
            let reward;
            if (mazeData[i][j] === 1) {
                color = 'darkgreen'
                type = 'open'
                reward = 0
            } else if (mazeData[i][j] === 2) {
                color = 'red'
                type = 'dead'
                reward = -10
            } else if (mazeData[i][j] === 3) {
                color = 'gold'
                type = 'goal'
                reward = 1000
            } else if (mazeData[i][j] === 0) {
                color = 'darkorange'
                type = 'start'
                reward = 0
            }
            let newSquare = {
                x: j * squareWidth + gap/2,
                y: i * squareHeight + gap/2,
                color: color,
                type: type,
                state: state,
                reward: reward,
                height: squareHeight - gap,
                width: squareWidth - gap
            }
            let square = new Square(newSquare)
            objects.push(square)
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
    console.log("Restarting game...");
    objects = [];
    createMaze();
    gamePiece = new GamePiece(gamePieceData);
    gamePiece.establishPointsPossible();
    objects.push(gamePiece);
    isAnimating = true;
    animate();
}

// this is the function that will handle the keydown events and move the gamePiece
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            gamePiece.move('left');
            break;
        case 'ArrowRight':
            gamePiece.move('right');
            break;
        case 'ArrowUp':
            gamePiece.move('up');
            break;
        case 'ArrowDown':
            gamePiece.move('down');
            break;
        case 'Enter':
            restartGame()
            break;
        case 'r':
            randomSolver();
            break;
    }
}

// this is the event listener that will listen for the keydown events and call the handleKeyDown function
document.addEventListener('keydown', handleKeyDown);

// i need to switch to having a start neww game button that starts the process of creating a new maze and gamePiece

let newGameButton = document.getElementById('newGameButton')
newGameButton.addEventListener('click', () => {
    restartGame()
})

const rollTheDice = () => {
    if (isAnimating === true){
    let details;
    let action;
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    randomNumber === 1 ? 
    action = 'left' :
    randomNumber === 2 ? 
    action = 'right' :
    randomNumber === 3 ? 
    action = 'up' :
    randomNumber === 4 ? 
    action = 'down' : null;
    details = gamePiece.move(action);

    // i need to be able to log the state of the gamePiece and the reward for the move

    console.log(`
    ~~~~~~~~~~~~~~~~
    State: ${details.state}
    Reward: ${details.reward}
    Moved: ${details.moved}
    Action: ${action}
    ~~~~~~~~~~~~~~~~`);
    return;
};
}



const randomSolver = () => {
    for (let i = 0; i < 1; i++) {
            rollTheDice()
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

// i need to  go back and associate a state with a position in the maze
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~








//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// well f**k me...
// i need to write this all over again for the q-learning algorithm
// i need to create a new maze and gamePiece that are based solely on an array of arrays that represent the maze and the gamePiece position for the q-learning algorithm
// s**t f**k d**n

let tempMazeData = mazeData

class  QMazing {
    constructor({mazeData}) {
        this.mazeData = mazeData;
        this.gamePiece = {
            x: 0,
            y: 0,
        };
        this.goalPosition = {
            x: 0,
            y: 0
        };
    }
    // this will find the initial position of the gamePiece based on the mazeData
    findStartPosition() {
        for (let i = 0; i < this.mazeData.length; i++) {
            let startIndex = this.mazeData[i].indexOf(0);
            if (startIndex !== -1) {
                this.gamePiece.x = startIndex;
                this.gamePiece.y = i;
                console.log(`start position: ${this.gamePiece.x}, ${this.gamePiece.y}`)
                break;
            }
        }
    }
    // this will find the goal position of the gamePiece based on the mazeData
    findGoalPosition() {
        for (let i = 0; i < this.mazeData.length; i++) {
            let goalIndex = this.mazeData[i].indexOf(3);
            if (goalIndex !== -1) {
                this.goalPosition = {
                    x: goalIndex,
                    y: i
                }
                console.log(`goal position: ${this.goalPosition.x}, ${this.goalPosition.y}`)
                break;
            }
        }
    }
    //initializeMaze 
    initializeMaze() {
       this.findGoalPosition();
       this.findStartPosition();
    }
    // this will find where the gamePiece can would move based on input direction
    findPotentialPosition(direction) {
        let potentialPosition;
        direction === 'left' ? potentialPosition = {x: this.gamePiece.x - 1, y: this.gamePiece.y} : 
        direction === 'right' ? potentialPosition = {x: this.gamePiece.x + 1, y: this.gamePiece.y} :
        direction === 'up' ? potentialPosition = {x: this.gamePiece.x, y: this.gamePiece.y - 1} :
        potentialPosition = {x: this.gamePiece.x, y: this.gamePiece.y + 1}
        return potentialPosition;
    }
    // this will find what the outcome will be based on the potential position
}

const qMaze = new QMazing({mazeData: tempMazeData})


qMaze.initializeMaze()
console.log(qMaze.findPotentialPosition('left'))



function displayGameBoard(mazeData) {

    //
    // Add vertical bars to each row
    mazeData = mazeData.map(row => `|| ${row.join(' ')} ||`);

    // Add horizontal bars and join rows
    let str = ' ' + mazeData.join(' \n ') + ' ';
// now i need to find and replace all 2s in the string with Xs
str = str.replace(/1/g, ' ').replace(/2/g, 'X').replace(/3/g, 'G').replace(/0/g, 'O');


    console.log(`\n =======================\n${str}\n =======================\n`);
}
displayGameBoard(tempMazeData);
