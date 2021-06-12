import {dispatch} from "./actions.js";
import {Game} from "./game.js";

let game = new Game();
game.Start();

// @ts-ignore
window.$ = dispatch.bind(null, game);

// @ts-ignore
window.game = game;
