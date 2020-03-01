import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_specular} from "../components/com_render_specular.js";
import {rotate} from "../components/com_rotate.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_phong(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.LightPositions = [];
    game.LightDetails = [];
    game.ViewportResized = true;
    game.GL.clearColor(0, 0, 0, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 5],
        ...blueprint_camera(game),
    });

    // Light 1.
    instantiate(game, {
        Using: [rotate([0, 0, 30])],
        Children: [
            {
                Translation: [0, 1, 5],
                Using: [light([1, 1, 1], 3)],
            },
        ],
    });

    let columns = 4;

    for (let x = 0; x < columns; x++) {
        instantiate(game, {
            Translation: [x - columns / 2 + 0.5, 0, 0],
            Using: [
                render_specular(
                    game.MaterialPhong,
                    game.MeshIcosphereSmooth,
                    [0, 1, 1, 1],
                    [1, 1, 1, 1],
                    10 ** x
                ),
            ],
        });
    }
}
