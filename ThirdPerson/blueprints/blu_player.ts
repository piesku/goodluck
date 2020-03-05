import {collide} from "../components/com_collide.js";
import {control_player} from "../components/com_control_player.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_player(game: Game) {
    return <Blueprint>{
        Rotation: [0, 1, 0, 0],
        Using: [control_player(true, true, false), move(10, 0.2), collide(true), rigid_body(true)],
        Children: [
            {
                // Body.
                Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1])],
            },
            {
                // Camera rig anchor.
                Using: [named("camera anchor"), move(), control_player(false, false, true)],
            },
            {
                Translation: [0, 5, 0],
                Using: [light_point([1, 1, 1], 5)],
            },
        ],
    };
}
