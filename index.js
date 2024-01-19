
let canvas = document.getElementById('myCanvas');
let c = canvas.getContext('2d');
let isAnimating = true;

c.fillStyle = 'black'; // Set the fill color
c.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle covering the entire canvas

let background
let gravityAcceleration = .8
let objects =[]

let lossCountElement = document.getElementById('lossCounter');
let lossCount = parseInt(lossCountElement.textContent.split(': ')[1]);
let winCountElement = document.getElementById('winCounter');
let winCount = parseInt(winCountElement.textContent.split(': ')[1]);
let mazeData = [
    [1,1,1,1,1,1,1,1,1],
    [2,2,2,1,1,2,1,1,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,1,1,1,1],
    [1,1,1,1,0,1,1,1,2],
    [1,2,1,1,1,1,1,1,1],
    [1,2,1,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,1,2,1,2,1,1,3],
]

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

let testSquare = {
    x: 5,
    y: 5,
    color: 'green',
    type: 'open'
}


class GamePiece {
    constructor({x, y, radius, color}) {
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
    update() {
        this.draw();
        this.checkCollision()
    }
    moveLeft() {
        if (this.position.x > 50) {
        this.position.x -= 100;    
        } else {
            console.log("no, no left")
        }
    }
    moveRight() {
        if (this.position.x < 850) {
        this.position.x += 100;
        } else {
            console.log("no, no right")
        }
    }
    moveUp() {
        if (this.position.y > 50) {
        this.position.y -= 100;
        } else {
            console.log("no, no up")
        }
    }
    moveDown() {
        if (this.position.y < 850) {
        this.position.y += 100;
        } else {
            console.log("no, no down")
        }
    }
    checkCollision() {
        //if the gamePiece is in the same position as a square that is not open goal or start, then the gamePiece should not be able to move in that direction
        //for each object in the objects array, check if the gamePiece is in the same position as that object
        //if it is, check if the object is not open, goal, or start
        //if it is not, then the gamePiece should not be able to move in that direction

        for (let i = 0; i < objects.length; i++) {
            if (this.position.x - 45 === objects[i].position.x && this.position.y - 45 === objects[i].position.y) {
                if (objects[i].type === 'dead') {
                    console.log("no no no")
                    for (let j = 0; j < objects.length; j++) {
                        if (objects[j].type !== 'dead') {
                        objects[j].color = 'pink'
                    }
                    
                    
                    isAnimating = false;
                    lossCount++;
                    lossCountElement.textContent = 'Losses: ' + (lossCount);
                }
                } else if (objects[i].type === 'goal') {
                    console.log("you win")
                    isAnimating = false;
                    
                    winCount++;
                    winCountElement.textContent = 'Wins: ' + (winCount);
                    // i want to set all of the objects colers to dark green to show the game has been won
                    for (let j = 0; j < objects.length; j++) {
                        if (objects[j].type == 'dead') {
                        objects[j].color = 'grey'
                       
                    }

                }
                } else if (objects[i].type === 'start') {
                    console.log("how did you end up here?????")
                } else {
                    console.log("you're good to go")
                    // i want to set the color of the one it landed on to a lime green to show that it's been visited
                    objects[i].color = 'limegreen'
                }
            }
        }
    }

 }
 
 let startPosition;

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
 
 let gamePieceData = {
   ...startPosition,
   radius: 40,
   color: 'purple'
 };
 
 let gamePiece;
 
 



let firstSquare = new Square(testSquare)
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
 objects.push(gamePiece);
animate()

}
const animate = () => {
    if (!isAnimating) {
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
    if (event.key === 'ArrowLeft') {
        gamePiece.moveLeft();
    } else if (event.key === 'ArrowRight') {
        gamePiece.moveRight();
    } else if (event.key === 'ArrowUp') {
        gamePiece.moveUp();
    } else if (event.key === 'ArrowDown') {
        gamePiece.moveDown();
    }
}
)

// i need to switch to having a start neww game button that starts the process of creating a new maze and gamePiece

let newGameButton = document.getElementById('newGameButton')
newGameButton.addEventListener('click', () => {
    console.log("starting new game")
    objects = []
    createMaze()
    gamePiece = new GamePiece(gamePieceData);
    objects.push(gamePiece);
    isAnimating = true;
    animate()
})