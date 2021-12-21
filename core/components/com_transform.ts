/**
 * @module components/com_transform
 */

import {create} from "../../common/mat4.js";
import {Mat4, Quat, Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
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
    Gyroscope: boolean;
}

export function transform(
    translation: Vec3 = [0, 0, 0],
    rotation: Quat = [0, 0, 0, 1],
    scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform | Has.Dirty;
        game.World.Transform[entity] = {
            World: create(),
            Self: create(),
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
            Gyroscope: false,
        };
    };
}

export function transform_gyroscope(
    translation: Vec3 = [0, 0, 0],
    rotation: Quat = [0, 0, 0, 1],
    scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform | Has.Dirty;
        game.World.Transform[entity] = {
            World: create(),
            Self: create(),
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
            Gyroscope: true,
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

    let parent = world.Transform[entity].Parent;
    if (parent !== undefined) {
        yield* query_up(world, parent, mask);
    }
}
