import {create_texture_from} from "../common/texture.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();

// @ts-ignore
window.game = game;

// @ts-ignore
for (let image of document.querySelectorAll("img")) {
    game.Textures[image.id] = create_texture_from(game.Gl, image);
}

scene_stage(game);
game.Start();
