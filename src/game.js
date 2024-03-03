const { EventEmitter } = require("events");

const Symbols = { X: "X", O: "O", EMPTY: " " };

class Player {
  #name;
  #moves;
  #symbol;
  constructor(name, symbol) {
    this.#name = name;
    this.#symbol = symbol;
    this.#moves = new Set();
  }

  recordMove(move) {
    this.#moves.add(move);
  }

  getDetails() {
    return this.#name;
  }

  numberOfMoves() {
    return this.#moves.size;
  }

  movesMade() {
    return [...this.#moves].map((move) => [move, this.#symbol]);
  }
}

class Players {
  #players;
  constructor(player1, player2) {
    this.#players = [player1, player2];
  }

  changeTurn() {
    this.#players.reverse();
  }

  recordMove(move) {
    this.#players[0].recordMove(move);
  }

  getCurrentPlayer() {
    // try not to break encapsulation?
    return this.#players[0].getDetails();
  }

  totalMovesMade() {
    return this.#players
      .map((player) => player.numberOfMoves())
      .reduce((a, b) => a + b);
  }

  hasWon() {
    return false;
  }

  movesMade() {
    return Object.fromEntries(
      this.#players.flatMap((player) => player.movesMade())
    );
  }
}

class Game {
  #players;
  #isGameOver;
  #winner;
  constructor(players) {
    this.#players = players;
  }

  makeMove(move) {
    this.#players.recordMove(move);

    if (this.#players.hasWon()) {
      this.#isGameOver = true;
      this.#winner = this.#players.getCurrentPlayer();
      return;
    }

    if (this.#players.totalMovesMade() === 9) {
      this.#isGameOver = true;
      return;
    }

    this.#players.changeTurn();
  }

  status() {
    return {
      moves: this.#players.movesMade(),
      currentPlayer: this.#players.getCurrentPlayer(),
      isGameOver: this.#isGameOver,
      winner: this.#winner,
    };
  }
}

class GameController {
  #game;
  #inputController;
  #renderer;
  constructor(game, inputController, renderer) {
    this.#game = game;
    this.#inputController = inputController;
    this.#renderer = renderer;
  }

  start() {
    this.#inputController.on("move-entered", (move) => {
      this.#game.makeMove(move);
      this.#renderer.render(this.#game.status());
    });

    this.#inputController.on("illegal-move", (move) => {
      console.log("Illegal move entered!");
    });

    this.#inputController.start();
  }
}

class KeyboardController extends EventEmitter {
  #stdin;
  #keymap;
  constructor(stdin, keymap) {
    super();
    this.#stdin = stdin;
    this.#keymap = keymap;
  }

  start() {
    this.#stdin.setRawMode(true);
    this.#stdin.setEncoding("utf-8");
    this.#stdin.on("data", (data) => {
      if (data === "\u0003") {
        this.#stdin.setRawMode(false);
        return;
      }
      if (this.#keymap[data] === undefined) {
        this.emit("illegal-move");
        return;
      }
      const [event, eventData] = this.#keymap[data];
      this.emit(event, eventData);
    });
  }
}

class GameRenderer {
  render({ moves, currentPlayer }) {
    for (let i = 0; i < 9; i += 3) {
      const row = [i, i + 1, i + 2].map((x) => moves[x] || " ").join("|");
      console.log(row);
    }
    console.log("");
    console.log(currentPlayer, "'s turn");
  }
}

module.exports = {
  Player,
  Players,
  Game,
  GameController,
  Symbols,
  KeyboardController,
  GameRenderer,
};
