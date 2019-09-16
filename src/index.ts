import {dispatch} from "./actions.js";
import {Game} from "./game.js";
import {world_stage} from "./worlds/wor_stage.js";

let game = new Game();
world_stage(game);
game.Start();

// @ts-ignore
window.$ = (...args) => dispatch(game, ...args);

// @ts-ignore
window.game = game;
