/**
 * # Collide2D
 *
 * The `Collide2D` component allows detecting AABB collisions between entities.
 *
 * When used together with [`RigidBody2D`](com_rigid_body2d.html), collisions are
 * processed by [`sys_physics2d_resolve`](sys_physics2d_resolve.html) to respond to
 * the physics simulation.
 *
 * When used together with [`Trigger`](com_trigger.html), collisions can trigger
 * arbitrary logic through `Actions`.
 */

import {AABB2D} from "../../lib/aabb2d.js";
import {Vec2} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export interface Collide2D extends AABB2D {
    EntityId: Entity;
    New: boolean;
    Dynamic: boolean;
    Layers: Layer;
    Mask: Layer;
    Collisions: Array<Collision>;
}

/**
 * Add the Collide2D component.
 *
 * @param dynamic Dynamic colliders collider with all colliders. Static
 * colliders collide only with dynamic colliders.
 * @param layers Bit field with layers this collider is on ("I'm a ...").
 * @param mask Bit mask with layers visible to this collider ("I'm interested in ...").
 * @param size Size of the collider in world units.
 */
export function collide2d(dynamic: boolean, layers: Layer, mask: Layer, size: Vec2 = [1, 1]) {
    return (game: Game, EntityId: Entity) => {
        game.World.Signature[EntityId] |= Has.Collide2D;
        game.World.Collide2D[EntityId] = {
            EntityId,
            New: true,
            Dynamic: dynamic,
            Layers: layers,
            Mask: mask,
            Size: size,
            Min: [0, 0],
            Max: [0, 0],
            Center: [0, 0],
            Collisions: [],
        };
    };
}

export interface Collision {
    /** The other entity in the collision. */
    Other: Entity;
    /** The direction and magnitude of the hit from this collider's POV. */
    Hit: Vec2;
}
