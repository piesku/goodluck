/**
 * # Transform
 *
 * The `Transform` component stores the entity's position, rotation and scale in
 * 3D space, as well as the entity's parent.
 *
 * For an entity to be processed by [`sys_transform`](sys_transform.html),
 * it must also be tagged as **dirty** with `Has.Dirty`.
 */

import {mat4_create} from "../../lib/mat4.js";
import {Mat4, Quat, Vec3} from "../../lib/math.js";
import {quat_copy, quat_from_euler} from "../../lib/quat.js";
import {vec3_copy} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Transform {
    /** Absolute matrix relative to the world. */
    World: Mat4;
    /** World to self matrix. */
    Self: Mat4;
    /** Local translation relative to the parent. */
    Translation: Vec3;
    /** Local rotation relative to the parent. */
    Rotation: Quat;
    /** Local scale relative to the parent. */
    Scale: Vec3;
    Parent?: Entity;
    /** Ignore parent's rotation and scale? */
    IsGyroscope: boolean;
}

/**
 * Add `Transform` to an entity.
 *
 * @param translation Local translation relative to the parent.
 * @param rotation Local rotation relative to the parent.
 * @param scale Local scale relative to the parent.
 * @param is_gyroscope Ignore parent's rotation and scale?
 */
export function transform(
    translation: Vec3 = [0, 0, 0],
    rotation: Quat = [0, 0, 0, 1],
    scale: Vec3 = [1, 1, 1],
    is_gyroscope: boolean = false,
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform | Has.Dirty;
        game.World.Transform[entity] = {
            World: mat4_create(),
            Self: mat4_create(),
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
            IsGyroscope: is_gyroscope,
        };
    };
}

/**
 * Set position in the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param x The X coordinate, relative to the parent.
 * @param y The Y coordinate, relative to the parent.
 * @param z The Z coordinate, relative to the parent.
 */
export function set_position(x: number, y: number, z: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        local.Translation[0] = x;
        local.Translation[1] = y;
        local.Translation[2] = z;
    };
}

/**
 * Copy a position into the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param translation Local translation relative to the parent.
 */
export function copy_position(translation: Vec3) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        vec3_copy(local.Translation, translation);
    };
}

/**
 * Set Euler (YXZ) rotation in the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param x Rotation around the X axis, in degrees. (Applied second.)
 * @param y Rotation around the Y axis, in degrees. (Applied first.)
 * @param z Rotation around the Z axis, in degrees. (Applied third.)
 */
export function set_rotation(x: number, y: number, z: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        quat_from_euler(local.Rotation, x, y, z);
    };
}

/**
 * Copy a rotation into the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param rotation Local rotation relative to the parent.
 */
export function copy_rotation(rotation: Quat) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        quat_copy(local.Rotation, rotation);
    };
}

/**
 * Set scale in the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param x The X scale, relative to the parent.
 * @param y The Y scale, relative to the parent.
 * @param z The Z scale, relative to the parent.
 */
export function set_scale(x: number, y: number, z: number) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        local.Scale[0] = x;
        local.Scale[1] = y;
        local.Scale[2] = z;
    };
}

/**
 * Copy a scale vector into the entity's transform.
 *
 * This mixin must be used after `transform()` in order to ensure that
 * the entity already has the `Transform` component.
 *
 * @param scale Local scale relative to the parent.
 */
export function copy_scale(scale: Vec3) {
    return (game: Game, entity: Entity) => {
        let local = game.World.Transform[entity];
        vec3_copy(local.Scale, scale);
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

    let parent = world.Transform[entity].Parent;
    if (parent !== undefined) {
        yield* query_up(world, parent, mask);
    }
}
