import {instantiate} from "../../common/game.js";
import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {blueprint_camera_minimap} from "../blueprints/blu_camera_minimap.js";
import {control_always} from "../components/com_control_always.js";
import {move} from "../components/com_move.js";
import {render_textured_unlit} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Main Camera.
    instantiate(game, [...blueprint_camera_main(game), transform([0, 0, 3], [0, 1, 0, 0])]);

    // Minimap Camera.
    instantiate(game, [
        ...blueprint_camera_minimap(game),
        transform([0, 5, 0], /* 90x, 0y, 0z */ [0.707, 0, 0, 0.707]),
    ]);

    // Checker Box.
    instantiate(game, [
        transform([-0.5, 0, 0]),
        control_always(null, [0.1276794, 0.1448781, 0.2685358, 0.9437144]),
        move(0, 1),
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshCube,
            game.Textures["checker1.png"]
        ),
    ]);

    // Minimap Plane.
    instantiate(game, [
        transform([1, 0, 0], [0.707, 0, 0, 0.707]),
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshPlane,
            game.Targets.Minimap.RenderTexture
        ),
    ]);
}
