/**
 * @module systems/sys_move
 */

import {Vec2} from "../../common/math.js";
import {add, length, normalize, scale, transform_direction} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.Move2D | Has.Dirty;

export function sys_move2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

const direction: Vec2 = [0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform2D[entity];
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
            let parent = game.World.Transform2D[transform.Parent];
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
    }

    if (move.Rotation) {
        transform.Rotation += move.Rotation * move.RotationSpeed * delta;

        move.Rotation = 0;
    }
}
