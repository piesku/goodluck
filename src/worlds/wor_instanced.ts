import {create_fly_camera} from "../blueprints/blu_fly_camera.js";
import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {render_vox} from "../components/com_render_vox.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

export function world_instanced(game: Game) {
    game.World = [];
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Player-controlled camera.
    game.Add({
        Translation: [0, 0, 5],
        ...create_fly_camera(game),
    });

    // Ground.
    game.Add({
        Translation: [0, -2, 0],
        Scale: [10, 1, 10],
        Using: [
            render_shaded(game.Materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    // Light and audio source.
    game.Add({
        Translation: [0, 3, 5],
        Using: [light([1, 1, 1], 5)],
    });

    game.Add({
        Translation: [0, 0, 0],
        Using: [render_vox(Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0]), [1, 0, 1])],
    });
}
