const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

////////////////////////////////////

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

////////////////////////////////////

function printInstructions() {
  console.log("Enter your play - grid coordinates followed by f (flag) or c (clear), i.e. A2c");
}

////////////////////////////////////

function Game(edgeLength, numMines) {
  this.columnLabels = "";
  this.board = [];

  var numSquares = Math.pow(edgeLength, 2);
  // fill with all zeros, then add in correct number of mines
  var tmpBoard = Array(numSquares).fill(0, 0, numSquares).fill('*', 0, numMines);
  //  shuffle array to distribute mines randomly
  shuffleArray(tmpBoard);

  var colCharCode = 'A'.charCodeAt();
  var startRow = 0;

  while (startRow < tmpBoard.length) {
    this.board.push(tmpBoard.slice(startRow, startRow + edgeLength));
    startRow += edgeLength;

    this.columnLabels += String.fromCharCode(colCharCode); // convert 65 to A
    colCharCode++;
  }

  this.isValidSquare = function(index) {
    return ((index >= 0) && (index < this.board.length));
  }

  var adjacent = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];

  this.board.forEach((el, rownum, arr) => {
    el.forEach((item, colnum) => {
      if (item == '*') {
        // try to increment each adjacent cell
        adjacent.forEach((adjItem) => {
          var row = rownum + adjItem[0];
          var col = colnum + adjItem[1];

          if ((this.isValidSquare(row)) &&
            (this.isValidSquare(col)) &&
            (this.board[row][col] != '*')) {
            this.board[row][col]++;
          }
        });
      }
    });
  });

  this.printBoard = function() {
    this.printDivider();

    // label the columns with letters
    console.log("  " + this.columnLabels);

    var toPrint = "";
    // print each row of board
    this.board.forEach((el, rownum) => {
      toPrint = (rownum + 1).toString() + " ";
      el.forEach((item) => {
        var printThis = (item !== ' ') ? '-' : ' ';
        toPrint += printThis;
      });
      console.log(toPrint);
    });

    this.printDivider();
  }

  this.printDivider = function() {
    var divider = "==";
    for (var i = 0; i < this.board.length; i++) {
      divider += "=";
    }
    console.log(divider);
  }

  this.isGameOver = function(col, row, action) {
    return false;
  }

  this.isValidAction = function(action) {
    if ((action == 'c') || (action == 'f'))
      return true;
    return false;
  }

  this.isValidPlay = function(col, row) {
    if ((this.columnLabels.indexOf(col) >= 0) && (row <= this.board.length))
      return true;
    return false;
  }

  // returns true if the game is over, false if it is not
  this.attemptPlay = function(play) {
    var col = play[0];
    var row = play[1];
    var action = play[2].toLowerCase();

    if (this.isValidAction(action)) {
      if (this.isValidPlay(col, row)) {
        return (this.isGameOver(col, row, action));
      }
      else {
        console.log('That space has already been cleared or is outside the play area. Please try again.');
      }
    }
    else {
      console.log('That is not a valid action. Please try again.');
    }

    return false;
  }

}

////////////////////////////////////

// initialize game
var myGame = new Game(8, 10);
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
  }
  else
    rl.close();
}).on('close', function() {
  // print board, all spaces exposed
  console.log('Game over');
  process.exit(0);
});