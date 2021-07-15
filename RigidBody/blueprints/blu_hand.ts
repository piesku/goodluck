import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {render_colored_shaded} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";

export function blueprint_hand(game: Game) {
    return [
        collide(true, Layer.Physics, Layer.Physics, [0.5, 0.5, 0.5]),
        rigid_body(RigidKind.Kinematic),
        children([
            transform(undefined, undefined, [3, 3, 3]),
            render_colored_shaded(game.MaterialColoredGouraud, game.MeshHand, [1, 1, 0.3, 1]),
        ]),
    ];
}
