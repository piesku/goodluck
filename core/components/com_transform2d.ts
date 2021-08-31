/**
 * @module components/com_transform2d
 */

import {create} from "../../common/mat2d.js";
import {Mat2D, Rad, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Transform2D {
    /** Absolute matrix relative to the world. */
    World: Mat2D;
    /** World to self matrix. */
    Self: Mat2D;
    /** Local translation relative to the parent. */
    Translation: Vec2;
    /** Local rotation relative to the parent. */
    Rotation: Rad;
    /** Local scale relative to the parent. */
    Scale: Vec2;
    Parent?: Entity;
    Dirty: boolean;
}

export function transform2d(translation: Vec2 = [0, 0], rotation: Rad = 0, scale: Vec2 = [1, 1]) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform2D;
        game.World.Transform2D[entity] = {
            World: create(),
            Self: create(),
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
            Dirty: true,
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

    let parent = world.Transform2D[entity].Parent;
    if (parent !== undefined) {
        yield* query_up(world, parent, mask);
    }
}
