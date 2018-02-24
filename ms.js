const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

////////////////////////////////////

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
/*if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0, targetLength);
    }
  };
}

// TODO: refactor this function
function shuffle(string) {

  var array = string.split('');
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  var newString = array.join('');
  return newString;
}*/

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

////////////////////////////////////

function printDivider() {
  console.log("==========");
}

function printInstructions() {
  console.log("Enter your play - grid coordinates followed by f (flag) or c (clear), i.e. A2c");
}

////////////////////////////////////

function Game(edgeLength, numMines) {
  this.columnLabels = "";
  this.board = [].fill('*', 0, numMines);

  var numSquares = Math.pow(edgeLength, 2);
/*  var tmpBoard = ''.padEnd(numMines, '*');
  tmpBoard = shuffle(tmpBoard.padEnd(numSquares, '0'));

  var colCharCode = 'A'.charCodeAt();
  var row = 0;

  while (row < tmpBoard.length) {
    this.board.push(tmpBoard.substr(row, edgeLength));
    this.columnLabels += String.fromCharCode(colCharCode); // convert 65 to A
    colCharCode++;
    row += edgeLength;
  }*/

  /*this.board.forEach((el, rownum, arr) => {
    console.log(el[0]);
    if (el[0] == '*') {
      console.log("here");
      console.log("before: " + el[1]);
      arr[rownum][1] = 1;
      console.log("after: " + el[1]);
    }

  });*/

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

  this.isGameOver = function(col, row, action) {
    return true;
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
  } else
    rl.close();
}).on('close', function() {
  // print board, all spaces exposed
  console.log('Game over');
  process.exit(0);
});