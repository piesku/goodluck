import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {render_specular} from "../components/com_render_specular.js";
import {rotate} from "../components/com_rotate.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.LightPositions = [];
    game.LightDetails = [];
    game.ViewportResized = true;
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 4],
        ...blueprint_camera(game),
    });

    instantiate(game, {
        Translation: [0, 0, 5],
        Using: [rotate([0, 0, 30])],
        Children: [
            {
                Translation: [0, 3, 0],
                Using: [light([1, 1, 1], 2)],
            },
            {
                Translation: [-3, 0, 0],
                Using: [light([1, 1, 1], 2)],
            },
            {
                Translation: [0, -3, 0],
                Using: [light([1, 1, 1], 2)],
            },
            {
                Translation: [3, 0, 0],
                Using: [light([1, 1, 1], 2)],
            },
        ],
    });

    // Points.
    instantiate(game, {
        Translation: [-1.5, 1, 0],
        Using: [render_basic(game.MaterialPoints, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Wireframe.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_basic(game.MaterialWireframe, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Basic.
    instantiate(game, {
        Translation: [1.5, 1, 0],
        Using: [render_basic(game.MaterialBasic, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Flat.
    instantiate(game, {
        Translation: [-1.5, -1, 0],
        Using: [render_shaded(game.MaterialFlat, game.MeshIcosphereFlat, [1, 1, 0.3, 1])],
    });

    // Gouraud.
    instantiate(game, {
        Translation: [0, -1, 0],
        Using: [render_shaded(game.MaterialGouraud, game.MeshIcosphereSmooth, [1, 1, 0.3, 1])],
    });

    // Phong.
    instantiate(game, {
        Translation: [1.5, -1, 0],
        Using: [render_specular(game.MaterialPhong, game.MeshIcosphereSmooth, [1, 1, 0.3, 1], 64)],
    });
}
