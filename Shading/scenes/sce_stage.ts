import {Cube} from "../../shapes/Cube.js";
import {Icosphere} from "../../shapes/Icosphere.js";
import {MonkeyFlat} from "../../shapes/MonkeyFlat.js";
import {MonkeySmooth} from "../../shapes/MonkeySmooth.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 2, 4],
        ...blueprint_camera(game),
    });

    // Light 1.
    instantiate(game, {
        Translation: [-2, 5, 5],
        Using: [light([1, 1, 1], 3)],
    });

    // Light 2.
    instantiate(game, {
        Translation: [1, 3, 5],
        Using: [light([1, 1, 1], 5)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1])],
    });

    // Points.
    instantiate(game, {
        Translation: [-2, 3, 0],
        Using: [render_basic(game.MaterialPoints, Icosphere, [1, 1, 0.3, 1])],
    });

    // Wireframe.
    instantiate(game, {
        Translation: [0, 3, 0],
        Using: [render_basic(game.MaterialWireframe, Icosphere, [1, 1, 0.3, 1])],
    });

    // Basic.
    instantiate(game, {
        Translation: [2, 3, 0],
        Using: [render_basic(game.MaterialBasic, Icosphere, [1, 1, 0.3, 1])],
    });

    // Flat.
    instantiate(game, {
        Translation: [-2, 1, 0],
        Using: [render_shaded(game.MaterialFlat, MonkeyFlat, [1, 1, 0.3, 1])],
    });

    // Gouraud.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_shaded(game.MaterialGouraud, MonkeySmooth, [1, 1, 0.3, 1])],
    });

    // Phong.
    instantiate(game, {
        Translation: [2, 1, 0],
        Using: [render_shaded(game.MaterialPhong, MonkeySmooth, [1, 1, 0.3, 1])],
    });
}
