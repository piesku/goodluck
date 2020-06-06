import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {render_specular} from "../components/com_render_specular.js";
import {rotate} from "../components/com_rotate.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 4],
        ...blueprint_camera(game),
    });

    // Directional light.
    instantiate(game, {
        Translation: [1, 1, 0],
        Using: [light_directional([1, 1, 1], 0.5)],
    });

    let light_spread = 7;
    let light_range = 4;
    instantiate(game, {
        Translation: [0, 0, 5],
        Using: [rotate([0, 0, 30])],
        Children: [
            {
                Translation: [1 * light_spread, 0, 0],
                Using: [light_point([1, 1, 1], light_range)],
            },
            {
                Translation: [-0.5 * light_spread, 0.866 * light_spread, 0],
                Using: [light_point([1, 1, 1], light_range)],
            },
            {
                Translation: [-0.5 * light_spread, -0.866 * light_spread, 0],
                Using: [light_point([1, 1, 1], light_range)],
            },
        ],
    });

    let shadings = [
        render_basic(game.MaterialBasicPoints, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_basic(game.MaterialBasicWireframe, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_basic(game.MaterialBasicTriangles, game.MeshIcosphereSmooth, [1, 1, 0, 1]),

        render_diffuse(game.MaterialDiffuseGouraud, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_diffuse(game.MaterialDiffusePhong, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_specular(game.MaterialSpecularGouraud, game.MeshIcosphereSmooth, [1, 1, 0, 1], 100),

        render_specular(game.MaterialSpecularPhong, game.MeshIcosphereSmooth, [1, 1, 0, 1], 10),
        render_specular(game.MaterialSpecularPhong, game.MeshIcosphereSmooth, [1, 1, 0, 1], 100),
        render_specular(game.MaterialSpecularPhong, game.MeshIcosphereSmooth, [1, 1, 0, 1], 1000),
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
