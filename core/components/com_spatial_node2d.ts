/**
 * # SpatialNode2D
 *
 * The `SpatialNode2D` component allows the entity to be part of the 2D scene
 * graph.
 *
 * Only entities with `SpatialNode2D` can be parented to other entities, or be
 * parents of other entities.
 */

import {mat2d_create} from "../../lib/mat2d.js";
import {Mat2D} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface SpatialNode2D {
    /** Absolute matrix relative to the world. */
    World: Mat2D;
    /** World to self matrix. */
    Self: Mat2D;
    Parent?: Entity;
    /** Ignore parent's rotation and scale? */
    IsGyroscope: boolean;
}

/**
 * Add `SpatialNode2D` to an entity.
 *
 * In order to be a parent of other entities, or to be a child of another entity,
 * the entity must also have the `SpatialNode2D` component. It's also required
 * if you're going to need to switch between the world space and the entity's
 * self space, or if you're going to query the entity's parent.
 *
 * Entities with `LocalTransform2D` and `SpatialNode2D` have their model matrix
 * computed in sys_transform2d() on the CPU, making them slower than entities
 * with only `LocalTransform2D`, but more fully-featured.
 *
 * @param is_gyroscope Ignore parent's rotation and scale?
 */
export function spatial_node2d(is_gyroscope = false) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.SpatialNode2D | Has.Dirty;
        game.World.SpatialNode2D[entity] = {
            World: game.World.InstanceData.subarray(
                entity * FLOATS_PER_INSTANCE,
                entity * FLOATS_PER_INSTANCE + 6,
            ),
            Self: mat2d_create(),
            IsGyroscope: is_gyroscope,
        };
    };
}

/**
 * Yield ascendants matching a component mask. Start at the current entity.
 *
 * @param world World object which stores the component data.
 * @param entity The first entity to test.
 * @param mask Component mask to look for.
 */
export function* query_up(world: World, entity: Entity, mask: Has): IterableIterator<Entity> {
    if ((world.Signature[entity] & mask) === mask) {
        yield entity;
    }

    let parent = world.SpatialNode2D[entity].Parent;
    if (parent !== undefined) {
        yield* query_up(world, parent, mask);
    }
}
