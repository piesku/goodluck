import {blueprint_camera} from "../blueprints/blu_camera.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional, light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_shaded, render_colored_unlit} from "../components/com_render1.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 4], [0, 1, 0, 0])]);

    // Directional light.
    instantiate(game, [transform([1, 1, 0]), light_directional([1, 1, 1], 0.5)]);

    let light_spread = 7;
    let light_range = 4;
    instantiate(game, [
        transform([0, 0, 5]),
        control_always(null, [0, 0, 1, 0]),
        move(0, 0.5),
        children(
            [transform([1 * light_spread, 0, 0]), light_point([1, 1, 1], light_range)],
            [
                transform([-0.5 * light_spread, 0.866 * light_spread, 0]),
                light_point([1, 1, 1], light_range),
            ],
            [
                transform([-0.5 * light_spread, -0.866 * light_spread, 0]),
                light_point([1, 1, 1], light_range),
            ]
        ),
    ]);

    let shadings = [
        render_colored_unlit(game.MaterialColoredPoints, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_unlit(game.MaterialColoredWireframe, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_unlit(game.MaterialColoredUnlit, game.MeshIcosphereSmooth, [1, 1, 0, 1]),

        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            0,
            [1, 1, 0, 1]
        ),
        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            32,
            [1, 1, 0, 1]
        ),
        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            512,
            [1, 1, 0, 1]
        ),

        render_colored_shaded(game.MaterialColoredPhong, game.MeshIcosphereSmooth, [1, 1, 0, 1], 0),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            32,
            [1, 1, 0, 1]
        ),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            512,
            [1, 1, 0, 1]
        ),
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
                instantiate(game, [transform([x - offset_x, y - offset_y, 0]), render]);
            }
        }
    }
}
