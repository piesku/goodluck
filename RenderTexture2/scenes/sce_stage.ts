import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {blueprint_camera_minimap} from "../blueprints/blu_camera_minimap.js";
import {control_move} from "../components/com_control_move.js";
import {move} from "../components/com_move.js";
import {render_textured_unlit} from "../components/com_render2.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Main Camera.
    instantiate(game, {
        Translation: [0, 0, 3],
        ...blueprint_camera_main(game),
    });

    // Minimap Camera.
    instantiate(game, {
        Translation: [0, 5, 0],
        ...blueprint_camera_minimap(game),
    });

    // Checker Box.
    instantiate(game, {
        Translation: [-0.5, 0, 0],
        Using: [
            control_move(null, [0.1276794, 0.1448781, 0.2685358, 0.9437144]),
            move(0, 1),
            render_textured_unlit(
                game.MaterialTexturedUnlit,
                game.MeshCube,
                game.Textures["checker1.png"]
            ),
        ],
    });

    // Minimap Plane.
    instantiate(game, {
        Translation: [1, 0, 0],
        Rotation: [0.707, 0, 0, 0.707],
        Using: [
            render_textured_unlit(
                game.MaterialTexturedUnlit,
                game.MeshPlane,
                game.Textures.MinimapRgba
            ),
        ],
    });
}
