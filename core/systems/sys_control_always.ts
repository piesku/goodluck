/**
 * @module systems/sys_control_always
 */

import {multiply} from "../../common/quat.js";
import {add} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {query_down} from "../components/com_children.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlAlways | Has.Transform | Has.Move;

export function sys_control_always(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlAlways[entity];
    let move = game.World.Move[entity];

    if (control.Direction) {
        add(move.Direction, move.Direction, control.Direction);
    }

    if (control.Rotation) {
        multiply(move.LocalRotation, move.LocalRotation, control.Rotation);
    }

    if (control.Animation) {
        for (let ent of query_down(game.World, entity, Has.Animate)) {
            let animate = game.World.Animate[ent];
            animate.Trigger = control.Animation;
        }
    }
}
