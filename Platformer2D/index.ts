import {dispatch} from "./actions.js";
import {Game} from "./game.js";
import {scene_platforms} from "./scenes/sce_platforms.js";

let game = new Game();
scene_platforms(game);
game.Start();

// @ts-ignore
window.$ = dispatch.bind(null, game);

// @ts-ignore
window.game = game;
