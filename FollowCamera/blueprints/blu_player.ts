import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_player} from "../components/com_control_player.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {render_colored_shaded} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";

export function blueprint_player(game: Game) {
    return [
        named("player"),
        transform(),
        control_player(true, 0.2, 0),
        move(10, 3),
        collide(true, Layer.Player, Layer.Terrain),
        rigid_body(RigidKind.Dynamic),
        children(
            // Body.
            [
                transform(),
                render_colored_shaded(
                    game.MaterialColoredShaded,
                    game.MeshMonkey,
                    [1, 0.3, 0.2, 1],
                ),
            ],
            // Camera rig anchor.
            [
                transform([0, 2, -8]),
                named("camera anchor"),
                move(0, 3),
                control_player(false, 0, 0.2, -10, 80),
            ],
            // Overhead light.
            [transform([0, 2, 0]), light_point([1, 1, 1], 5)],
        ),
    ];
}
