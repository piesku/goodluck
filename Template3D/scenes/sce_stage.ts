import {Cube} from "../../shapes/Cube.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    game.Add({
        Translation: [1, 2, 5],
        ...blueprint_camera(game),
    });

    // Light.
    game.Add({
        Translation: [2, 3, 5],
        Using: [light([1, 1, 1], 5)],
    });

    // Ground.
    game.Add({
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1])],
    });

    // Box.
    game.Add({
        Translation: [0, 1, 0],
        Using: [render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1])],
    });
}
