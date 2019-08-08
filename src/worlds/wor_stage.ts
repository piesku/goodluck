import {camera} from "../components/com_camera.js";
import {render_basic} from "../components/com_render_basic.js";
import {rotate} from "../components/com_rotate.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Icosphere} from "../shapes/index.js";

export function world_stage(game: Game) {
    game.world = [];
    game.fog_color = [1, 0.3, 0.3, 1];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    game.add({
        translation: [0, 0, 10],
        using: [camera(game.canvas.width / game.canvas.height, 1, 0.1, 1000)],
    });

    game.add({
        translation: [0, 0, 0],
        using: [
            render_basic(game.materials[Mat.Wireframe], Icosphere, [1, 1, 0.3, 1]),
            rotate(2, 3, 4),
        ],
    });
}
