/**
 * @module components/com_transform2d
 */

import {create} from "../../common/mat2d.js";
import {Deg, Mat2D, Vec2} from "../../common/math.js";
import {copy} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface LocalTransform2D {
    /** Local translation relative to the parent. */
    Translation: Vec2;
    /** Local rotation relative to the parent. */
    Rotation: Deg;
    /** Local scale relative to the parent. */
    Scale: Vec2;
}

/**
 * Add `LocalTransform2D` to an entity.
 *
 * `LocalTransform2D` component only stores the local (parent-space) transform
 * data. If the entity is a top-level entity, the local data is also the
 * world-space data.
 *
 * In order to be a parent of other entities, or to be a child of another entity,
 * the entity must also have the `SpatialNode2D` component (see `spatial_node2d()`).
 *
 * OTOH, entities with `LocalTransform2D` but without `SpatialNode2D` have their
 * model matrix computed in the shader, making them very fast to update.
 *
 * @param translation Local translation relative to the parent.
 * @param rotation Local rotation relative to the parent.
 * @param scale Local scale relative to the parent.
 */
export function local_transform2d(
    translation: Vec2 = [0, 0],
    rotation: Deg = 0,
    scale: Vec2 = [1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.LocalTransform2D | Has.Dirty;
        game.World.LocalTransform2D[entity] = {
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
        };
    };
}

/**
 * Copy a position into the entity's local transform.
 *
 * This mixin must be used after `local_transform2d()` in order to ensure that
 * the entity already has the `LocalTransform2D` component.
 *
 * @param translation Local translation relative to the parent.
 */
export function copy_position(translation: Vec2) {
    return (game: Game, entity: Entity) => {
        let local = game.World.LocalTransform2D[entity];
        copy(local.Translation, translation);
    };
}

export interface SpatialNode2D {
    /** Absolute matrix relative to the world. */
    World: Mat2D;
    /** World to self matrix. */
    Self: Mat2D;
    Parent?: Entity;
    /** Ignore parent's rotation and scale? */
    Gyroscope: boolean;
}

/**
 * Add `SpatialNode2D` to an entity.

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
            World: game.InstanceData.subarray(
                entity * FLOATS_PER_INSTANCE,
                entity * FLOATS_PER_INSTANCE + 6
            ),
            Self: create(),
            Gyroscope: is_gyroscope,
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
