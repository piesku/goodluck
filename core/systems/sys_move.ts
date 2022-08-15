/**
 * # sys_move
 *
 * Move and rotate entities.
 */

import * as quat from "../../lib/quat.js";
import * as vec3 from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move;

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
        let amount = Math.min(1, vec3.length(move.Direction));
        // Transform the direction into the world or the parent space. This will
        // also scale the result by the scale encoded in the transform.
        vec3.transform_direction(move.Direction, move.Direction, transform.World);
        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent];
            vec3.transform_direction(move.Direction, move.Direction, parent.Self);
        }
        // Normalize the direction to remove the transform's scale. The length
        // of the orignal direction is now lost.
        vec3.normalize(move.Direction, move.Direction);
        // Scale by the amount and distance traveled in this tick.
        vec3.scale(move.Direction, move.Direction, amount * move.MoveSpeed * delta);
        vec3.add(transform.Translation, transform.Translation, move.Direction);
        game.World.Signature[entity] |= Has.Dirty;
        vec3.set(move.Direction, 0, 0, 0);
    }

    // Rotations applied relative to the local space (parent's or world).
    if (move.LocalRotation[3] < 1) {
        // Pre-multiply.
        quat.multiply(move.LocalRotation, move.LocalRotation, transform.Rotation);

        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        quat.slerp(transform.Rotation, transform.Rotation, move.LocalRotation, t);

        game.World.Signature[entity] |= Has.Dirty;
        quat.set(move.LocalRotation, 0, 0, 0, 1);
    }

    // Rotations applied relative to the self space.
    if (move.SelfRotation[3] < 1) {
        // Post-multiply.
        quat.multiply(move.SelfRotation, transform.Rotation, move.SelfRotation);

        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        quat.slerp(transform.Rotation, transform.Rotation, move.SelfRotation, t);

        game.World.Signature[entity] |= Has.Dirty;
        quat.set(move.SelfRotation, 0, 0, 0, 1);
    }
}
