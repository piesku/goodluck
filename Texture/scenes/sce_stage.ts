import {blueprint_camera} from "../blueprints/blu_camera.js";
import {control_move} from "../components/com_control_move.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_textured_diffuse, render_textured_unlit} from "../components/com_render1.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 3],
        ...blueprint_camera(game),
    });

    // Directional light.
    instantiate(game, {
        Translation: [1, 1, 1],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Unlit kulka.
    instantiate(game, {
        Translation: [-1, 0, 0],
        Using: [
            control_move(null, [0, 1, 0, 0]),
            move(0, 0.5),
            render_textured_unlit(
                game.MaterialTexturedUnlit,
                game.MeshKulka,
                game.Textures["checker1"]
            ),
        ],
    });

    // Diffuse kulka.
    instantiate(game, {
        Translation: [1, 0, 0],
        Using: [
            control_move(null, [0, 1, 0, 0]),
            move(0, 0.5),
            render_textured_diffuse(
                game.MaterialTexturedDiffuse,
                game.MeshKulka,
                game.Textures["checker1"]
            ),
        ],
    });
}
