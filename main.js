const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this._field = field;
    this._fielWidth = field[0].length;
    this._fieldHeight = field.length;
    this._playerX = 0;
    this._playerY = 0;
    this._gameEnded = false;
  }

  print() {
    for (let i = 0; i < this._fieldHeight; i++) {
      const fieldRow = this._field[i];
      console.log(fieldRow.join(""));
    }
  }

  static generateField(height, width, percentage) {
    const randomizedField = [];
    const fieldSize = height * width;
    let totalHoles = Math.floor(fieldSize * (percentage / 100));

    //Generate empty field
    for (let i = 0; i < height; i++) {
      let helperArray = [];
      for (let j = 0; j < width; j++) {
        helperArray.push(fieldCharacter);
      }
      randomizedField.push(helperArray);
    }

    //Add player on first position
    randomizedField[0][0] = pathCharacter;

    //Add hat on random position
    const hatHeight = Math.floor(Math.random() * height);
    const hatWidth = Math.floor(Math.random() * height);
    randomizedField[hatHeight][hatWidth] = hat;

    //Add holes to field
    while (totalHoles > 0) {
      const randomHeight = Math.floor(Math.random() * height);
      const randomWidth = Math.floor(Math.random() * width);

      if (randomizedField[randomHeight][randomWidth] === fieldCharacter) {
        randomizedField[randomHeight][randomWidth] = hole;
        totalHoles--;
      }
    }

    return randomizedField;
  }

  playerMove() {
    const availableMoves = ["w", "s", "a", "d"];

    //Ask for user input
    console.log("Which direction would you like to move?");
    let input = prompt("'↑W   ↓S   →D   ←A'");

    while (!availableMoves.includes(input.toLowerCase())) {
      console.log("Incorrect command. Please use WASD to move");
      console.log("Which direction would you like to move?");
      let input = prompt("'↑W   ↓S   →D   ←A'");
    }

    switch (input.toLowerCase()) {
      case "w":
        this._playerY -= 1;
        break;
      case "s":
        this._playerY += 1;
        break;
      case "d":
        this._playerX += 1;
        break;
      case "a":
        this._playerX -= 1;
        break;
      default:
        break;
    }
  }

  checkPosition() {
    const x = this._playerX;
    const y = this._playerY;
    //Checking if player position is out of bounds
    if (x < 0 || x >= this._fieldWidth || y < 0 || y >= this._fieldHeight) {
      console.log("**********************************");
      console.log("YOU'RE OUT OF BOUNDS - GAME LOST!");
      console.log("**********************************");
      this._gameEnded = true;
    }
    //Checking if player fell in a hole
    if (this._field[y][x] === hole) {
      console.log("**********************************");
      console.log("YOU'VE FELL IN A HOLE - GAME LOST!");
      console.log("**********************************");
      this._gameEnded = true;
    }
    //Checking if player found hat
    if (this._field[y][x] === hat) {
      console.log("**********************************");
      console.log("YOU'VE FOUND THE HAT - GAME WON!");
      console.log("**********************************");
      this._gameEnded = true;
    }
    //Checking if position is free and marking the path
    if (
      this._field[y][x] === fieldCharacter ||
      this._field[y][x] === pathCharacter
    ) {
      this._field[y][x] = pathCharacter;
    }
  }

  newGame() {
    console.log("**********************************");
    console.log("A NEW GAME STARTED - FIND YOUR HAT!");
    console.log("**********************************");

    //Repeat turns until game has ended
    do {
      this.print();
      this.playerMove();
      this.checkPosition();
    } while (this._gameEnded === false);
  }

  playAgain() {
    console.log("Would you like to play again?");
    let input = prompt(" Yes (Y) - No (N)");

    switch (input.toLowerCase()) {
      case "y":
        this._gameEnded = false;
        this.newGame();
        break;
      case "n":
        console.log("BEGONE LOSER!");
      default:
        break;
    }
  }
}
//Percentage of holes in field - random between 25 and 50
const holesPercentage = Math.floor(Math.random() * (50 - 25)) + 25;
//Generate random height and width
const fieldHeight = Math.floor(Math.random() * (10 - 5)) + 5;
const fieldWidth = Math.floor(Math.random() * (18 - 6)) + 6;
//Generate randomField
const randomField = Field.generateField(
  fieldHeight,
  fieldWidth,
  holesPercentage
);

const newField = new Field(randomField);

newField.newGame();
