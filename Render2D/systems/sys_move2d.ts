/**
 * @module systems/sys_move
 */

import {Quat, Vec3} from "../../common/math.js";
import {from_axis, multiply} from "../../common/quat.js";
import {add, length, normalize, scale, transform_direction} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move2D;
const NO_ROTATION: Quat = [0, 0, 0, 1];

export function sys_move2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

const direction: Vec3 = [0, 0, 0];
const axis_z: Vec3 = [0, 0, 1];
const rotation: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let move = game.World.Move2D[entity];

    if (move.Direction[0] || move.Direction[1]) {
        direction[0] = move.Direction[0];
        direction[1] = move.Direction[1];

        // Directions are not normalized to allow them to express slower
        // movement from a gamepad input. They can also cancel each other out.
        // They may not, however, intensify one another; hence max amount is 1.
        let amount = Math.min(1, length(direction));

        // Transform the direction into the world or the parent space. This will
        // also scale the result by the scale encoded in the transform.
        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent];
            transform_direction(direction, direction, parent.Self);
        } else {
            transform_direction(direction, direction, transform.World);
        }

        // Normalize the direction to remove the transform's scale. The length
        // of the orignal direction is now lost.
        normalize(direction, direction);

        // Scale by the amount and distance traveled in this tick.
        scale(direction, direction, amount * move.MoveSpeed * delta);

        add(transform.Translation, transform.Translation, direction);

        move.Direction[0] = 0;
        move.Direction[1] = 0;
        game.World.Signature[entity] |= Has.Dirty;
    }

    if (move.Rotation) {
        from_axis(rotation, axis_z, move.RotationSpeed * delta);
        multiply(transform.Rotation, rotation, transform.Rotation);

        move.Rotation = false;
        game.World.Signature[entity] |= Has.Dirty;
    }
}
