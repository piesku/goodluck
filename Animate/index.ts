import {Game} from "./game.js";
import {loop_start} from "./impl.js";
import {scene_rigging} from "./scenes/sce_rigging.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();
false && scene_stage(game);
scene_rigging(game);
loop_start(game);

// @ts-ignore
window.game = game;
