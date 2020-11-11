import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_hand} from "../blueprints/blu_hand.js";
import {collide} from "../components/com_collide.js";
import {control_move} from "../components/com_control_move.js";
import {control_spawner} from "../components/com_control_spawner.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
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
            rigid_body(RigidKind.Static),
        ],
    });

    // Static wall.
    instantiate(game, {
        Translation: [4, 1, 0],
        Scale: [1, 1, 10],
        Using: [
            render_colored_diffuse(game.MaterialUnlitDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
            collide(false, Layer.Terrain, Layer.None),
            rigid_body(RigidKind.Static),
        ],
    });

    // Box spawner.
    instantiate(game, {
        Translation: [0, 5, 0],
        Using: [control_spawner(2, 0.3)],
    });

    // Rotating hand.
    instantiate(game, {
        Translation: [0, 1, -3],
        Using: [control_move(null, [0, 1, 0, 0]), move(0, 2)],
        Children: [
            {
                ...blueprint_hand(game),
                Translation: [0, 0, -3],
            },
        ],
    });
}
