/**
 * # ControlAlways
 *
 * Stores movement, rotation, and animation that will be applied to the entity
 * every frame by [`sys_move`](sys_move.html) and
 * [`sys_animate`](sys_animate.html), respectively.
 *
 *     instantiate(game, [
 *         transform(),
 *         // Move the entity in its forward direction every frame.
 *         control_always([0, 0, 1]),
 *         // When moving, travel at the speed of 3 units per second.
 *         move(3, 0)
 *     ]);
 */

import {Quat, Vec3} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";
import {Animate} from "./com_animate.js";

export interface ControlAlways {
    Direction: Vec3 | null;
    Rotation: Quat | null;
    Animation: Animate["Trigger"];
}

/**
 * Add `ControlAlways` to an entity.
 *
 * @param direction Direction to move in the entity's self space.
 * @param rotation Rotation to rotate to in the entity's self space. This should
 * be a unit quaternion to indicate the direction of the rotation, e.g. `[0, 1,
 * 0, 0]` for a counter-clockwise rotation around the Y axis.
 * @param animation Animation clip to play.
 */
export function control_always(
    direction: Vec3 | null,
    rotation: Quat | null,
    animation?: Animate["Trigger"],
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlAlways;
        game.World.ControlAlways[entity] = {
            Direction: direction,
            Rotation: rotation,
            Animation: animation,
        };
    };
}
