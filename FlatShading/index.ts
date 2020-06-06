import {loop_start} from "./core.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();
scene_stage(game);
loop_start(game);

// @ts-ignore
window.game = game;
