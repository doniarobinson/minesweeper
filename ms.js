const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

////////////////////////////////////

function printDivider() {
  console.log("==========");
}

function printInstructions() {
  console.log("Enter your play - grid coordinates followed by f (flag) or c (clear), i.e. A2c");
}

////////////////////////////////////

function Game(edgeLength, numMines) {
  // TODO: generate board dynamically
  this.board = [
    '__*_',
    '_*__',
    '_*__',
    '__**'
  ];

  this.columnLabels = 'ABCD';

  this.displayBoard = [
    ['____'],
    ['____'],
    ['____'],
    ['____']
  ];
  this.board = this.displayBoard;

  this.printBoard = function() {
    printDivider();

    // label the columns with letters
    console.log("  " + this.columnLabels);

    var toPrint = "";
    // print each row of board
    this.board.forEach((el, rownum) => {
      toPrint = (rownum + 1).toString() + " " + el;
      /* use this code if each row is an array
      for (var col = 0; col < el.length; col++) {
        toPrint += el[col];
      }*/
      console.log(toPrint);
    });

    printDivider();
  }

  this.updateBoard = function(col, row, action) {
    return false;
  }

  this.checkValidAction = function(action) {
    if ((action == 'c') || (action == 'f'))
      return true;
    return false;
  }

  this.checkValidPlay = function(col, row) {
    if ((this.columnLabels.indexOf(col) >= 0) && (row <= this.board.length))
      return true;
    return false;
  }

  // returns true if the game is over, false if it is not
  this.attemptPlay = function(play) {
    var col = play[0];
    var row = play[1];
    var action = play[2].toLowerCase();

    if (this.checkValidAction(action)) {
      if (this.checkValidPlay(col, row)) {
        return this.updateBoard(col, row, action);
      } else {
        console.log('That space has already been cleared or is outside the play area. Please try again.');
      }
    } else {
      console.log('That is not a valid action. Please try again.');
    }

    return true;
  }

}

////////////////////////////////////

// initialize game
var myGame = new Game(4, 5);
var gameOver = false;

// game play
myGame.printBoard();
printInstructions();
rl.prompt();

rl.on('line', function(line) {
  gameOver = myGame.attemptPlay(line);
  if (gameOver === false) {
    myGame.printBoard();
    printInstructions();
    rl.prompt();
  } else
    rl.close();
}).on('close', function() {
  // print exposed board
  console.log('Game over');
  process.exit(0);
});