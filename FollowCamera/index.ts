import {input_pointer_lock} from "../common/input.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();
input_pointer_lock(game);
scene_stage(game);
game.Start();

// @ts-ignore
window.game = game;
