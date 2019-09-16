import {Game} from "./game.js";
import {world_stage} from "./worlds/wor_stage.js";

let game = new Game();
world_stage(game);
game.start();

// @ts-ignore
window.$ = (...args) => game.Dispatch(...args);

// @ts-ignore
window.game = game;
