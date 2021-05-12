import {dispatch} from "./actions.js";
import {Game} from "./game.js";
import {loop_start} from "./impl.js";

let game = new Game();
loop_start(game);

// @ts-ignore
window.$ = dispatch.bind(null, game);

// @ts-ignore
window.game = game;
