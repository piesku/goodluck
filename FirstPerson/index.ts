import {input_pointer_lock} from "../common/input.js";
import {dispatch} from "./actions.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();
input_pointer_lock(game);
scene_stage(game);
game.Start();

// @ts-ignore
window.$ = dispatch.bind(null, game);

// @ts-ignore
window.game = game;
