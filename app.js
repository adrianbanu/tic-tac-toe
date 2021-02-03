const Gameboard = (function(){
  const board = new Array(9);
  let boardCells = document.getElementsByClassName("cell");
  document.getElementById("restart").addEventListener("click",startGame);

  function addToBoard(place, symbol){
    board[place] = symbol;
  }

  function setEvents(){
    for(let i = 0; i < boardCells.length; i++){
      boardCells[i].addEventListener("click", Game.addSymbol, {once: true});
    }
  }

  function deleteEvents(){
    for(let i = 0; i < boardCells.length; i++){
      boardCells[i].removeEventListener("click", Game.addSymbol);
    }
  }

  function cleanBoard(){
    for(let i = 0; i < boardCells.length; i++){
      boardCells[i].innerHTML = "";
    }
  }

  //the board is set up and the game can (re)start
  function startGame(){
    cleanBoard();
    setEvents();
    board.splice(0, board.length);
    Game.gameText();
    Game.removeHighlight();
  }

  return{
    startGame: startGame,
    addToBoard: addToBoard,
    deleteEvents: deleteEvents,
    board
  };

})();

const Player = function(name, symbol, color){
  return {name, symbol, color};
}

const Game = (function(){
  let numberMoves = 0;
  let counter = 0;
  let gameMessage = document.getElementById("game-winner"); 
  let winHigh = []; //for the winning combination if found on the board

  let winningPositions = [["0","1","2"], ["3","4","5"], ["6","7","8"], ["0","3","6"], 
                          ["1","4","7"], ["2","5","8"], ["0","4","8"], ["2","4","6"]];
  let currentConfiguration = [];

  let player1 = Player(document.getElementById("player1").value, "X", "blue");
  let player2 = Player(document.getElementById("player2").value, "0", "red");

  let currentMove = player2.symbol;

  function gameText(){
    if(player1.symbol == currentMove){
      gameMessage.innerHTML = `${player2.name} moves next!`;
      gameMessage.style.color = player2.color;
    }else{
      gameMessage.innerHTML = `${player1.name} moves next!`;
      gameMessage.style.color = player1.color;
    }
  }

  function gameWinner(){
    gameMessage.innerHTML = (player1.symbol == currentMove) ? `${player1.name} wins!`: `${player2.name} wins!`;
    numberMoves = 0;
    Gameboard.deleteEvents();
    highlightWin(winHigh);
  }

  function highlightWin(cells){
    if (currentMove == player1.symbol)
      addColor(cells, player1.color);
    else
      addColor(cells, player2.color);
  }

  function removeHighlight(){
    if(winHigh.length > 0)
      addColor(winHigh, "black");
    numberMoves = 0;
  }

  function addColor(toColor, color){
    document.getElementById(`id${toColor[0]}`).style.color = color;
    document.getElementById(`id${toColor[1]}`).style.color = color;
    document.getElementById(`id${toColor[2]}`).style.color = color;
  }

  //the first function activated when clicking on the board. It all flows from here on each turn
  function addSymbol(){
    if(currentMove == player1.symbol){
      player1.name = document.getElementById("player1").value;
      registerMove(player2.symbol);
    }else{
      player2.name = document.getElementById("player2").value;
      registerMove(player1.symbol);
    }

    if(numberMoves > 4){
      if (gameWon()){
        gameWinner();
      }else{
        if(numberMoves == 9){
          gameMessage.innerHTML = "It's a draw!";
          gameMessage.style.color = "black";
          numberMoves = 0;
        }else
          gameText();
      }
    }else
      gameText();
  }

  function registerMove(simbol){
    document.getElementById(event.target.id).innerHTML = simbol;
    currentMove = simbol;
    numberMoves++;
    Gameboard.addToBoard(event.target.id.slice(-1,), currentMove);
  }

  //checks if there is a winning combination on the board. Returns true or false
  function gameWon(){
    
    Gameboard.board.forEach(getMoves);

    function getMoves(item, index){
      if(item == currentMove){
        currentConfiguration[counter] = index;
        counter++;
      }
    }

    let findSolution = false;

    for(let i = 0; i < winningPositions.length; i++){
      findSolution = winningPositions[i].every(checkWin);
      if(findSolution) {
        winHigh = winningPositions[i];
        break;
      }
    }

    function checkWin(str){ 
      return currentConfiguration.sort().join().replace(/,/g,"").indexOf(str) > -1;
    }

    currentConfiguration.length = 0;
    counter = 0;
    
    return findSolution;
  }

  return{
    addSymbol: addSymbol,
    gameText: gameText,
    removeHighlight: removeHighlight
  };

})();

window.addEventListener("DOMContentLoaded", Gameboard.startGame);