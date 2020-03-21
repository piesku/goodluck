import {load_texture, loop_start} from "./core.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let texture = new Image();
texture.src = "/textures/kulka.png";
texture.onload = () => {
    let game = new Game();

    load_texture(game, texture);
    scene_stage(game);
    loop_start(game);

    // @ts-ignore
    window.game = game;
};
