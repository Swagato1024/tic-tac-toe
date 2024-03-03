const {
  Symbols,
  Game,
  GameController,
  Player,
  Players,
  KeyboardController,
  GameRenderer,
} = require("./src/game");
// const EventEmitter = require('events');

const keymap = {
  q: ["move-entered", 0],
  w: ["move-entered", 1],
  e: ["move-entered", 2],
  a: ["move-entered", 3],
  s: ["move-entered", 4],
  d: ["move-entered", 5],
  z: ["move-entered", 6],
  x: ["move-entered", 7],
  c: ["move-entered", 8],
};

const main = () => {
  const p1 = new Player("bittu", Symbols.X);
  const p2 = new Player("riya", Symbols.O);
  const players = new Players(p1, p2);
  const game = new Game(players);
  const keyboardController = new KeyboardController(process.stdin, keymap);
  const gc = new GameController(game, keyboardController, new GameRenderer());
  gc.start();
};

main();
