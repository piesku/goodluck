import {dispatch} from "./actions.js";
import {Game} from "./game.js";
import {world_instanced} from "./worlds/wor_instanced.js";

let game = new Game();
world_instanced(game);
game.Start();

// @ts-ignore
window.$ = (...args) => dispatch(game, ...args);

// @ts-ignore
window.game = game;
