let gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver = false;

const players = [
  {
    name: "",
    symbol: "X",
  },
  {
    name: "",
    symbol: "O",
  },
];

const editPlayerBtn1Element = document.getElementById("edit-player-1-btn");
const editPlayerBtn2Element = document.getElementById("edit-player-2-btn");

const configOverlayElement = document.getElementById("config-overlay");
const backdropElement = document.getElementById("backdrop");

const cancelBtnElement = document.getElementById("cancel-btn");
const submitBtnElement = document.getElementById("submit-btn");
const startGameBtn = document.getElementById("start-game-btn");

const errorOutputElement = document.getElementById("config-errors");
const formElement = document.querySelector("form");

const activeGameField = document.getElementById("active-game-field");
const activePlayerName = document.getElementById("active-player-name");
const gameBoardElement = document.getElementById("game-board");
const gameResultOutput = document.getElementById("game-result-output");

const gameFieldElements = document.querySelectorAll("#game-board li");
const winnerName = document.getElementById("winner-name");
console.dir(winnerName);

function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid;
  configOverlayElement.style.display = "block";
  backdropElement.style.display = "block";
}

function closePlayerConfig() {
  backdropElement.style.display = "none";
  configOverlayElement.style.display = "none";
  formElement.firstElementChild.classList.remove("error");
  errorOutputElement.textContent = "";
  formElement.firstElementChild.lastElementChild.value = "";
}

function savePlayerConfig(event) {
  event.preventDefault();
  let formData = new FormData(event.target);
  let enteredPlayername = formData.get("playername").trim();

  if (!enteredPlayername) {
    event.target.firstElementChild.classList.add("error");
    errorOutputElement.textContent = "Please enter a valid name!";
    errorOutputElement.style.color = "darkred";
    return;
  }

  const updatedPlayerDataElement = document.getElementById(
    "player-" + editedPlayer + "-data"
  );
  updatedPlayerDataElement.children[0].textContent = enteredPlayername;

  players[editedPlayer - 1].name = enteredPlayername;

  closePlayerConfig();
}

function resetGameStatus() {
  activePlayer = 0;
  currentRound = 1;
  gameIsOver = false;
  gameResultOutput.firstElementChild.innerHTML =
    'You Won, <span id="winner-name">PLAYER NAME</span> !';
  gameResultOutput.style.display = "none";
  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameData[i][j] = 0;
      const gameBoardItemElement = gameBoardElement.children[gameBoardIndex];
      gameBoardItemElement.textContent = "";
      gameBoardItemElement.classList.remove("disabled");
      gameBoardIndex++;
    }
  }
}

function startNewGame() {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please set custom player name for both players!");
    return;
  }
  resetGameStatus();
  activePlayerName.textContent = players[activePlayer].name;
  activeGameField.style.display = "block";
}

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }

  activePlayerName.textContent = players[activePlayer].name;
}

function selectGameField(event) {
  if (gameIsOver) {
    return;
  }

  const selectedField = event.target;
  const selectedFieldCol = selectedField.dataset.col - 1;
  const selectedFieldRow = selectedField.dataset.row - 1;

  if (gameData[selectedFieldCol][selectedFieldRow] > 0) {
    alert("Please select an empty field!");
    return;
  }

  selectedField.textContent = players[activePlayer].symbol;
  selectedField.classList.add("disabled");

  gameData[selectedFieldCol][selectedFieldRow] = activePlayer + 1;

  const winnerId = checkForGameOver();
  if (winnerId !== 0) {
    endGame(winnerId);
  }

  currentRound++; // Similar function currentRound = currentRound + 1
  switchPlayer();
}

function checkForGameOver() {
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[1][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  if (
    gameData[0][2] > 0 &&
    gameData[0][2] === gameData[1][1] &&
    gameData[1][1] === gameData[2][0]
  ) {
    return gameData[0][2];
  }

  if (currentRound === 9) {
    return -1;
  }

  return 0;
}

function endGame(winnerId) {
  gameIsOver = true;
  gameResultOutput.style.display = "block";
  if (winnerId > 0) {
    const winnerNameElement = players[winnerId - 1].name;
    gameResultOutput.firstElementChild.firstElementChild.textContent =
      winnerNameElement;
  } else {
    gameResultOutput.firstElementChild.textContent = "It's a draw!";
  }
}

editPlayerBtn1Element.addEventListener("click", openPlayerConfig);
editPlayerBtn2Element.addEventListener("click", openPlayerConfig);

backdropElement.addEventListener("click", closePlayerConfig);
cancelBtnElement.addEventListener("click", closePlayerConfig);
formElement.addEventListener("submit", savePlayerConfig);

startGameBtn.addEventListener("click", startNewGame);

for (const gameFieldElement of gameFieldElements) {
  gameFieldElement.addEventListener("click", selectGameField);
}
