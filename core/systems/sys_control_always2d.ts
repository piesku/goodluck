/**
 * @module systems/sys_control_always2d
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlAlways2D | Has.Move2D;

export function sys_control_always2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlAlways2D[entity];
    let move = game.World.Move2D[entity];

    if (control.Direction) {
        move.Direction[0] = control.Direction[0];
        move.Direction[1] = control.Direction[1];
        game.World.Signature[entity] |= Has.Dirty;
    }

    if (control.Rotation) {
        move.Rotation = control.Rotation;
        game.World.Signature[entity] |= Has.Dirty;
    }
}
