import {Game} from "./game.js";
import {loop_start} from "./impl.js";
import {scene_rigging} from "./scenes/sce_rigging.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();
scene_stage(game);
false && scene_rigging(game);
loop_start(game);

// @ts-ignore
window.game = game;
