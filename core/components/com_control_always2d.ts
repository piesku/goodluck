/**
 * # ControlAlways2D
 *
 * Stores movement and rotation that will be applied to the entity every frame
 * by [`sys_move_2d`](sys_move_2d.html).
 *
 *     instantiate(game, [
 *         local_transform2d(),
 *         // Move the entity in its up direction every frame.
 *         control_always2d([0, 1]),
 *         // When moving, travel at the speed of 3 units per second.
 *         move2d(3, 0)
 *     ]);
 */

import {Vec2} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlAlways2D {
    Direction: Vec2 | null;
    Rotation: number;
}

/**
 * Add `ControlAlways2D` to an entity.
 *
 * @param direction Direction to move in the entity's self space.
 * @param rotation Direction to rotate to in the entity's self space: 1 = CCW,
 * -1 = CW.
 */
export function control_always2d(direction: Vec2 | null, rotation: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlAlways2D;
        game.World.ControlAlways2D[entity] = {
            Direction: direction,
            Rotation: rotation,
        };
    };
}
