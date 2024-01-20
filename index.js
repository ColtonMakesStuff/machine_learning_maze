
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


// this is the data that will be used to create the maze
// 1 = open
// 2 = dead
// 3 = goal
// 0 = start

let mazeData = [
    [1,1,1,1,1,1,1,1,1],
    [2,2,0,1,1,2,1,1,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,1,1,1,1],
    [1,1,1,1,2,1,1,1,2],
    [1,2,1,1,1,1,1,1,1],
    [1,2,1,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,1,2,3,2,1,1,1],
]

// this is to find the total points possible in the maze
function countElements(mazeData) {
    return mazeData.reduce((total, row) => total + row.length, 0);
}

let totalPoints = countElements(mazeData);




// estableshes the square class
class Square {
    constructor({x, y, color, type }) {
        this.position= {
            x: x,
            y: y
        }
       this.width = 90
       this.height = 90
       this.type = type
       this.color = color
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
        this.checkCollision()
    }
    establishPointsPossible() {
        pointCounterElement.textContent = 'Points Possible: ' + (this.pointsPossible);
    }
    // moves the gamePiece in the direction of the arrow key pressed
    move(direction) {
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
    
        if ((newX >= 50 && newX <= 850) && (newY >= 50 && newY <= 850)) {
            if (this.checkBeforeMove(direction) !== 'nope') {
                this.pointsPossible -= 1;
                this.position.x = newX;
                this.position.y = newY;
            } else {
                console.log(`No, no ${direction}`);
                this.pointsPossible -= 20;
            }
        }
        console.log(`points possible: ${this.pointsPossible}`)
        pointCounterElement.textContent = 'Points Possible: ' + (this.pointsPossible);

    }
    
    checkBeforeMove( direction ) {
   // I am changing my methods to be able to prevent the gamePiece from moving into a square that is not open, goal, or start
        let potentialPosition;
        direction === 'left' ? potentialPosition = {x: this.position.x - 100, y: this.position.y} : 
        direction === 'right' ? potentialPosition = {x: this.position.x + 100, y: this.position.y} :
        direction === 'up' ? potentialPosition = {x: this.position.x, y: this.position.y - 100} :
        potentialPosition = {x: this.position.x, y: this.position.y + 100}



        for (let i = 0; i < objects.length; i++) {
            if (potentialPosition.x - 45 === objects[i].position.x && potentialPosition.y - 45 === objects[i].position.y) {
                if (objects[i].type === 'dead') {
                    return "nope"
                }
            }
        }
    
   
   
    }

    checkCollision() {
        for (let i = 0; i < objects.length; i++) {
            if (this.position.x - 45 === objects[i].position.x && this.position.y - 45 === objects[i].position.y) {
                objects[i].type === 'goal' 
                    ? (() => {
                        console.log("you win");
                        console.log(`total points: ', ${this.pointsPossible}`)
                        isAnimating = false;
                        for (let j = 0; j < objects.length; j++) {
                            objects[j].type == 'dead' ? objects[j].color = 'grey' : null;
                        }
                     })()
                    : objects[i].type === 'start'
                        ? null
                        : 
                        objects[i].color = 'limegreen';
                        
            }
        }
    }
}    
 
 let startPosition;

 // this is the code that will find the start position of the gamePiece and set it to the startPosition variable
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
            if (mazeData[i][j] === 1) {
                color = 'darkgreen'
                type = 'open'
            } else if (mazeData[i][j] === 2) {
                color = 'red'
                type = 'dead'
            } else if (mazeData[i][j] === 3) {
                color = 'gold'
                type = 'goal'
            } else if (mazeData[i][j] === 0) {
                color = 'darkorange'
                type = 'start'
            }

            let newSquare = {
                x: j * 100 + 5,
                y: i * 100 + 5,
                color: color,
                type: type
            }
            let square = new Square(newSquare)
            objects.push(square)
        }
    }
}

window.onload = function() {
console.log("starting game")  
createMaze(); // Call the createMaze function
 gamePiece = new GamePiece(gamePieceData);
 gamePiece.establishPointsPossible()
 objects.push(gamePiece);
animate()

}
const animate = () => {
    if (!isAnimating) {
        // i need to update the pointsScored element with the points possible
        pointsScoredElement.textContent = 'Points Scored: ' + (pointsScored + gamePiece.pointsPossible);
        return;
    }
    window.requestAnimationFrame(animate);
  
    c.fillStyle = 'black'; // Set the fill color to white
    c.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle covering the entire canvas
  
    // First draw the squares
    objects.forEach((object) => {
        if (object instanceof Square) {
            object.update();
        }
    });
  
    // Then draw the game piece
    objects.forEach((object) => {
        if (object instanceof GamePiece) {
            object.update();
        }
    });

  }
  
//now i need to listen for keydowns of the arrow keys to be able to move the gamePiece for manual testing

document.addEventListener('keydown', (event) => {
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
            console.log("restarting...")
            objects = []
            createMaze()
            gamePiece = new GamePiece(gamePieceData);
            gamePiece.establishPointsPossible()
            objects.push(gamePiece);
            isAnimating = true;
            animate()
            break;
    }
});


// i need to switch to having a start neww game button that starts the process of creating a new maze and gamePiece

let newGameButton = document.getElementById('newGameButton')
newGameButton.addEventListener('click', () => {
    console.log("starting new game")
    objects = []
    createMaze()
    gamePiece = new GamePiece(gamePieceData);
    gamePiece.establishPointsPossible()
    objects.push(gamePiece);
    isAnimating = true;
    animate()
})


