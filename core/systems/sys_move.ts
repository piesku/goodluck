/**
 * @module systems/sys_move
 */

import {Quat, Vec3} from "../../common/math.js";
import {multiply, slerp} from "../../common/quat.js";
import {add, length, normalize, scale, transform_direction} from "../../common/vec3.js";
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

    if (move.Directions.length) {
        let direction = move.Directions.reduce(add_directions);
        // Directions are not normalized to allow them to express slower
        // movement from a gamepad input. They can also cancel each other out.
        // They may not, however, intensify one another; hence max amount is 1.
        let amount = Math.min(1, length(direction));
        // Transform the direction into the world or the parent space. This will
        // also scale the result by the scale encoded in the transform.
        transform_direction(direction, direction, transform.World);
        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent];
            transform_direction(direction, direction, parent.Self);
        }
        // Normalize the direction to remove the transform's scale. The length
        // of the orignal direction is now lost.
        normalize(direction, direction);
        // Scale by the amount and distance traveled in this tick.
        scale(direction, direction, amount * move.MoveSpeed * delta);
        add(transform.Translation, transform.Translation, direction);
        transform.Dirty = true;
        move.Directions = [];
    }

    // Rotations applied relative to the local space (parent's or world).
    if (move.LocalRotations.length) {
        let rotation = move.LocalRotations.reduce(multiply_rotations);
        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        slerp(rotation, NO_ROTATION, rotation, t);

        // Pre-multiply.
        multiply(transform.Rotation, rotation, transform.Rotation);
        transform.Dirty = true;
        move.LocalRotations = [];
    }

    // Rotations applied relative to the self space.
    if (move.SelfRotations.length) {
        let rotation = move.SelfRotations.reduce(multiply_rotations);
        let t = Math.min(1, (move.RotationSpeed / Math.PI) * delta);
        slerp(rotation, NO_ROTATION, rotation, t);

        // Post-multiply.
        multiply(transform.Rotation, transform.Rotation, rotation);
        transform.Dirty = true;
        move.SelfRotations = [];
    }
}

function add_directions(acc: Vec3, cur: Vec3) {
    return add(acc, acc, cur);
}

function multiply_rotations(acc: Quat, cur: Quat) {
    return multiply(acc, acc, cur);
}
