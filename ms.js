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
  console.log("Enter your play - grid coordinates followed by f (flag), u (unflag) or c (clear space), i.e. A2c");
}

////////////////////////////////////

function Game(edgeLength, numMines) {
  this.columnLabels = "";
  this.firstTurn = true;
  this.edgeLength = edgeLength;
  this.numMines = numMines;

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

  this.isValidSquare = function(colNum, row) {
    if ((row >= 0) && (row < this.board.length) &&
      (colNum >= 0) && (colNum < this.board.length))
      return true;
    return false;
  }

  this.makeBoard = function() {
    this.board = [];
    var numSquares = Math.pow(this.edgeLength, 2);
    // fill with all zeros, then add in correct number of mines
    var tmpBoard = Array(numSquares).fill(0, 0, numSquares).fill('*', 0, this.numMines);
    //  shuffle array to distribute mines randomly
    shuffleArray(tmpBoard);

    var colCharCode = 'A'.charCodeAt();
    var startRow = 0;

    this.columnLabels = "";
    while (startRow < tmpBoard.length) {
      this.board.push(tmpBoard.slice(startRow, startRow + this.edgeLength));
      startRow += this.edgeLength;

      this.columnLabels += String.fromCharCode(colCharCode); // convert 65 to A
      colCharCode++;
    }

    this.board.forEach((el, rownum, arr) => {
      el.forEach((item, colnum) => {
        if (item == '*') {
          // try to increment each adjacent cell
          adjacent.forEach((adjItem) => {
            var row = rownum + adjItem[0];
            var col = colnum + adjItem[1];

            if ((this.isValidSquare(col, row)) &&
              (this.board[row][col] != '*')) {
              this.board[row][col]++;
            }
          });
        }
      });
    });

  }

  this.makeBoard();

  this.display = Array(edgeLength).fill().map(() => Array(edgeLength).fill('h'));
  // h - hidden, no flag
  // e - exposed
  // f - hidden, flag

  this.printBoard = function() {
    this.printDivider();

    // label the columns with letters
    console.log("  " + this.columnLabels);

    var toPrint = "";
    // print each row of board
    this.board.forEach((el, rownum) => {
      toPrint = (rownum + 1).toString() + " ";
      el.forEach((item, colnum) => {
        var printThis = '-';
        if (this.display[rownum][colnum] == 'e') {
          if (item == 0)
            printThis = ' ';
          else
            printThis = item;
        }
        else if (this.display[rownum][colnum] == 'f')
          printThis = 'f';
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

  this.exposeAdjacent = function(rownum, colnum) {
    // expose all adjacencies that are numbers
    // if they are zero, also call exposeAdjacent again

    adjacent.forEach((adjItem) => {
      var row = rownum + adjItem[0];
      var col = colnum + adjItem[1];

      if ((this.isValidSquare(col, row)) &&
        (this.display[row][col] == 'h')) {
        this.display[row][col] = 'e';
        if (this.board[row][col] == 0) {
          this.exposeAdjacent(row, col);
        }
      }
    });
  }

  this.exposeEntireBoard = function() {
    for (var i = 0; i < this.display.length; i++) {
      for (var j = 0; j < this.display.length; j++) {
        if (this.board[i][j] == '*')
          this.display[i][j] = 'e';
      }
    }
  }

  this.isGameOver = function() {
    for (var i = 0; i < this.display.length; i++) {
      for (var j = 0; j < this.display.length; j++) {
        if ((this.board[i][j] != '*') && (this.display[i][j] != 'e'))
          return false;
      }
    }
    console.log("Congratulations, you won the whole thing!");
    return true;
  }

  this.makePlay = function(col, row, action) {
    // how can a game be over? user tried to 'clear' mine or all mines are correctly flagged


    if (this.firstTurn == true) {
      while (this.board[row][col] != 0) {
        // rearrange board until the square they chose is a 0
        this.makeBoard();
      }

      this.firstTurn = false;
    }

    if (this.display[row][col] != 'e') {

      if (action == 'c') {

        if (this.board[row][col] == '*') {
          this.display[row][col] = 'e';
          this.board[row][col] = 'X';
          console.log('Uh oh, you hit a mine');
          return true;
        }
        else {
          this.display[row][col] = 'e';
          if (this.board[row][col] == 0) {
            // expose all adjacent 0 squares
            this.exposeAdjacent(row, col);
          }
          // is game over?
        }
      }
      else if (action == 'f') {
        this.display[row][col] = 'f';
        // is game over?
      }
      else if (action == 'u') {
        this.display[row][col] = 'h';
        return false;
      }

    }

    return this.isGameOver();
  }

  this.isValidAction = function(action) {
    var validActions = 'cfu';
    if (validActions.indexOf(action) >= 0)
      return true;
    return false;
  }

  // returns true if the game is over, false if it is not
  this.attemptPlay = function(play) {
    var colNum = play[0].toUpperCase().charCodeAt() - 'A'.charCodeAt();
    var row = play[1] - 1; // change to zero index
    var action = play[2].toLowerCase();

    if (this.isValidAction(action)) {
      if (this.isValidSquare(colNum, row)) {
        return this.makePlay(colNum, row, action);
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
  console.log('\n');
  gameOver = myGame.attemptPlay(line);
  if (gameOver === false) {
    myGame.printBoard();
    printInstructions();
    rl.prompt();
  }
  else
    rl.close();
}).on('close', function() {
  // print board, all mines exposed
  console.log('');
  myGame.exposeEntireBoard();
  myGame.printBoard();
  console.log('Game over');
  process.exit(0);
});