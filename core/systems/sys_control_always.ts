/**
 * @module systems/sys_control_always
 */

import {Quat} from "../../common/math.js";
import {add} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
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
        move.LocalRotations.push(control.Rotation.slice() as Quat);
    }
}
