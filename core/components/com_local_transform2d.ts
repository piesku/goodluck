/**
 * # LocalTransform2D
 *
 * The `LocalTransform2D` component allows the entity to be positioned in 2D
 * space.
 *
 * `LocalTransform2D` only stores the local (parent-space) transform data. If
 * the entity is a top-level entity, the local data is also the world-space
 * data.
 *
 * In order to be a parent of other entities, or to be a child of another entity,
 * the entity must also have the [`SpatialNode2D`](com_spatial_node2d.html) component.
 *
 * OTOH, entities with `LocalTransform2D` but without `SpatialNode2D` have their
 * model matrix computed in the shader, making them very fast to update.
 *
 * For an entity to be processed by [`sys_transform2d`](sys_transform2d.html),
 * it must also be tagged as **dirty** with `Has.Dirty`.
 */

import {Deg, Vec2} from "../../lib/math.js";
import {vec2_copy} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

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
 * the entity must also have the `SpatialNode2D` component.
 *
 * @param translation Local translation relative to the parent.
 * @param rotation Local rotation relative to the parent.
 * @param scale Local scale relative to the parent.
 */
export function local_transform2d(
    translation: Vec2 = [0, 0],
    rotation: Deg = 0,
    scale: Vec2 = [1, 1],
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
 * Set position in the entity's transform.
 *
 * This mixin must be used after `local_transform2d()` in order to ensure that
 * the entity already has the `LocalTransform2D` component.
 *
 * @param x The X coordinate, relative to the parent.
 * @param y The Y coordinate, relative to the parent.
 */
export function set_position(x: number, y: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.LocalTransform2D[entity];
        local.Translation[0] = x;
        local.Translation[1] = y;
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
        vec2_copy(local.Translation, translation);
    };
}

/**
 * Set rotation in the entity's transform.
 *
 * This mixin must be used after `local_transform2d()` in order to ensure that
 * the entity already has the `LocalTransform2D` component.
 *
 * @param z The rotation in degrees, relative to the parent.
 */
export function set_rotation(z: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.LocalTransform2D[entity];
        local.Rotation = z;
    };
}

/**
 * Set scale in the entity's transform.
 *
 * This mixin must be used after `local_transform2d()` in order to ensure that
 * the entity already has the `LocalTransform2D` component.
 *
 * @param x The X scale, relative to the parent.
 * @param y The Y scale, relative to the parent.
 */
export function set_scale(x: number, y: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.LocalTransform2D[entity];
        local.Scale[0] = x;
        local.Scale[1] = y;
    };
}

/**
 * Copy a scale vector into the entity's local transform.
 *
 * This mixin must be used after `local_transform2d()` in order to ensure that
 * the entity already has the `LocalTransform2D` component.
 *
 * @param scale Local scale relative to the parent.
 */
export function copy_scale(scale: Vec2) {
    return (game: Game, entity: Entity) => {
        let local = game.World.LocalTransform2D[entity];
        vec2_copy(local.Scale, scale);
    };
}
