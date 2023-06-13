/**
 * # sys_move
 *
 * Move and rotate entities.
 */

import {Vec2} from "../../lib/math.js";
import {
    vec2_add,
    vec2_length,
    vec2_normalize,
    vec2_rotate,
    vec2_scale,
    vec2_transform_direction,
} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.LocalTransform2D | Has.Move2D | Has.Dirty;

export function sys_move2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

const direction: Vec2 = [0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let local = game.World.LocalTransform2D[entity];
    let move = game.World.Move2D[entity];

    if (move.Direction[0] || move.Direction[1]) {
        // Directions are given in the entity's self space, i.e. [0, 1] is the
        // entity's up, not the world's up.
        direction[0] = move.Direction[0];
        direction[1] = move.Direction[1];

        // Directions are not normalized to allow them to express slower
        // movement from a gamepad input. They can also cancel each other out.
        // They may not, however, intensify one another; hence max amount is 1.
        let amount = Math.min(1, vec2_length(direction));

        if (game.World.Signature[entity] & Has.SpatialNode2D) {
            // Transform the direction into the world or the parent space. This will
            // also scale the result by the scale encoded in the transform.
            let node = game.World.SpatialNode2D[entity];
            if (node.Parent !== undefined) {
                let parent = game.World.SpatialNode2D[node.Parent];
                vec2_transform_direction(direction, direction, parent.Self);
            } else {
                vec2_transform_direction(direction, direction, node.World);
            }
        } else {
            // The entity isn't a spatial node, i.e. it's guaranteed to be a
            // top-level entity. Transform the direction into the world space.
            vec2_rotate(direction, direction, local.Rotation);
        }

        // Normalize the direction to remove the transform's scale. The length
        // of the orignal direction is now lost.
        vec2_normalize(direction, direction);

        // Scale by the amount and distance traveled in this tick.
        vec2_scale(direction, direction, amount * move.MoveSpeed * delta);

        vec2_add(local.Translation, local.Translation, direction);

        move.Direction[0] = 0;
        move.Direction[1] = 0;
    }

    if (move.Rotation) {
        local.Rotation += move.Rotation * move.RotationSpeed * delta;

        move.Rotation = 0;
    }
}
