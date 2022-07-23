import {load_spritesheet} from "../common/load.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();

// @ts-ignore
window.game = game;

Promise.all([load_spritesheet(game, "spritesheet.png")]).then(() => {
    scene_stage(game);
    game.Start();
});
