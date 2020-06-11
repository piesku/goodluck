import {create} from "../../common/mat2d.js";
import {Mat2D, Rad, Vec2} from "../../common/math.js";
import {Entity, Game} from "../game.js";
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
    Children: Array<Entity>;
    Dirty: boolean;
}

export function transform2d(Translation: Vec2 = [0, 0], Rotation: Rad = 0, Scale: Vec2 = [1, 1]) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Transform2D;
        game.World.Transform2D[entity] = {
            World: create(),
            Self: create(),
            Translation,
            Rotation,
            Scale,
            Children: [],
            Dirty: true,
        };
    };
}

/**
 * Yield entities matching a component mask. The query is tested against the
 * parent and all its descendants.
 *
 * @param world World object which stores the component data.
 * @param parent Parent entity to traverse.
 * @param mask Component mask to look for.
 */
export function* query_all(world: World, parent: Entity, mask: Has): IterableIterator<Entity> {
    if (world.Mask[parent] & mask) {
        yield parent;
    }
    for (let child of world.Transform2D[parent].Children) {
        yield* query_all(world, child, mask);
    }
}
