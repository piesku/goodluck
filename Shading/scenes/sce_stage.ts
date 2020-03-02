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
                Translation: [0, 4, 0],
                Using: [light([1, 1, 1], 3)],
            },
            {
                Translation: [-4, 0, 0],
                Using: [light([1, 1, 1], 3)],
            },
            {
                Translation: [0, -4, 0],
                Using: [light([1, 1, 1], 3)],
            },
            {
                Translation: [4, 0, 0],
                Using: [light([1, 1, 1], 3)],
            },
        ],
    });

    let shadings = [
        render_basic(game.MaterialPoints, game.MeshIcosphereSmooth, [1, 1, 0.3, 1]),
        render_basic(game.MaterialWireframe, game.MeshIcosphereSmooth, [1, 1, 0.3, 1]),
        render_basic(game.MaterialBasic, game.MeshIcosphereSmooth, [1, 1, 0.3, 1]),

        render_shaded(game.MaterialFlat, game.MeshIcosphereFlat, [1, 1, 0.3, 1]),
        render_shaded(game.MaterialGouraud, game.MeshIcosphereSmooth, [1, 1, 0.3, 1]),
        render_shaded(game.MaterialPhong, game.MeshIcosphereSmooth, [1, 1, 0.3, 1]),

        render_specular(game.MaterialSpecularFlat, game.MeshIcosphereFlat, [1, 1, 0.3, 1], 100, [
            1,
            1,
            1,
            1,
        ]),
        render_specular(
            game.MaterialSpecularGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0.3, 1],
            100
        ),
        render_specular(game.MaterialSpecularPhong, game.MeshIcosphereSmooth, [1, 1, 0.3, 1], 100),
    ];

    let rows = 3;
    let cols = 3;
    let pad = 0.25;

    let offset_x = (cols + pad * (cols - 1)) / 2;
    let offset_y = (rows + pad * (rows - 1)) / 2;

    for (let row = rows - 1; row >= 0; row--) {
        let y = row * (1 + pad) + 0.5;
        for (let col = 0; col < cols; col++) {
            let render = shadings.shift();
            if (render) {
                let x = col * (1 + pad) + 0.5;
                instantiate(game, {
                    Translation: [x - offset_x, y - offset_y, 0],
                    Using: [render],
                });
            }
        }
    }
}
