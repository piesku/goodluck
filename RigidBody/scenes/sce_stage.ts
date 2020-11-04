import {blueprint_camera} from "../blueprints/blu_camera.js";
import {collide} from "../components/com_collide.js";
import {control_spawner} from "../components/com_control_spawner.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {instantiate} from "../entity.js";
import {Game, Layer} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, {
        Translation: [0, 2, 5],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [2, 3, 5],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [
            render_colored_diffuse(game.MaterialUnlitDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
            collide(false, Layer.Terrain, Layer.None),
            rigid_body(false),
        ],
    });

    // Box spawner.
    instantiate(game, {
        Translation: [0, 5, 0],
        Using: [control_spawner(2, 0.3)],
    });
}
