import {collide} from "../components/com_collide.js";
import {control_player} from "../components/com_control_player.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../entity.js";
import {Game, Layer} from "../game.js";

export function blueprint_player(game: Game): Blueprint {
    return {
        Rotation: [0, 1, 0, 0],
        Using: [
            control_player(true, 0.2, 0),
            move(10, 3),
            collide(true, Layer.Player, Layer.Terrain),
            rigid_body(RigidKind.Dynamic),
        ],
        Children: [
            {
                // Body.
                Using: [
                    render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [
                        1,
                        1,
                        0.3,
                        1,
                    ]),
                ],
            },
            {
                // Camera rig anchor.
                Using: [named("camera anchor"), move(0, 3), control_player(false, 0, 0.2)],
            },
            {
                Translation: [0, 5, 0],
                Using: [light_point([1, 1, 1], 5)],
            },
        ],
    };
}
