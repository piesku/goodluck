/**
 * @module systems/sys_move
 */

import {Quat} from "../../common/math.js";
import {multiply, set as quat_set, slerp} from "../../common/quat.js";
import {
    add,
    length,
    normalize,
    scale,
    set as vec3_set,
    transform_direction,
} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move;
const NO_ROTATION: Quat = [0, 0, 0, 1];

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let move = game.World.Move[entity];

    if (move.Direction[0] !== 0 || move.Direction[1] !== 0 || move.Direction[2] !== 0) {
        // Directions are not normalized to allow them to express slower
        // movement from a gamepad input. They can also cancel each other out.
        // They may not, however, intensify one another; hence max amount is 1.
        let amount = Math.min(1, length(move.Direction));
        // Transform the direction into the world or the parent space. This will
        // also scale the result by the scale encoded in the transform.
        transform_direction(move.Direction, move.Direction, transform.World);
        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent];
            transform_direction(move.Direction, move.Direction, parent.Self);
        }
        // Normalize the direction to remove the transform's scale. The length
        // of the orignal direction is now lost.
        normalize(move.Direction, move.Direction);
        // Scale by the amount and distance traveled in this tick.
        scale(move.Direction, move.Direction, amount * move.MoveSpeed * delta);
        add(transform.Translation, transform.Translation, move.Direction);
        game.World.Signature[entity] |= Has.Dirty;
        vec3_set(move.Direction, 0, 0, 0);
    }

    // Rotations applied relative to the local space (parent's or world).
    if (move.LocalRotation[3] < 1) {
        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        slerp(move.LocalRotation, NO_ROTATION, move.LocalRotation, t);

        // Pre-multiply.
        multiply(transform.Rotation, move.LocalRotation, transform.Rotation);
        game.World.Signature[entity] |= Has.Dirty;
        quat_set(move.LocalRotation, 0, 0, 0, 1);
    }

    // Rotations applied relative to the self space.
    if (move.SelfRotation[3] < 1) {
        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        slerp(move.SelfRotation, NO_ROTATION, move.SelfRotation, t);

        // Post-multiply.
        multiply(transform.Rotation, transform.Rotation, move.SelfRotation);
        game.World.Signature[entity] |= Has.Dirty;
        quat_set(move.SelfRotation, 0, 0, 0, 1);
    }
}
