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
    game.LightPositions = [];
    game.LightDetails = [];
    game.ViewportResized = true;
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
        Translation: [1, 4, 5],
        Using: [light([1, 1, 1], 5)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [render_shaded(game.MaterialGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });

    // Points.
    instantiate(game, {
        Translation: [-1.5, 3, 0],
        Using: [render_basic(game.MaterialPoints, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Wireframe.
    instantiate(game, {
        Translation: [0, 3, 0],
        Using: [render_basic(game.MaterialWireframe, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Basic.
    instantiate(game, {
        Translation: [1.5, 3, 0],
        Using: [render_basic(game.MaterialBasic, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Flat.
    instantiate(game, {
        Translation: [-1.5, 1, 0],
        Using: [render_shaded(game.MaterialFlat, game.MeshIcosphereFlat, [1, 1, 0.3, 1])],
    });

    // Gouraud.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_shaded(game.MaterialGouraud, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Phong.
    instantiate(game, {
        Translation: [1.5, 1, 0],
        Using: [render_shaded(game.MaterialPhong, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });
}
