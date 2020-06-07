import {create} from "../../common/mat4.js";
import {Mat4, Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {World} from "../world.js";
import {Has} from "./com_index.js";

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
    /** This Transform's entity id. */
    readonly EntityId: Entity;
    Parent?: Entity;
    Children: Array<Entity>;
    Dirty: boolean;
}

export function transform(
    Translation: Vec3 = [0, 0, 0],
    Rotation: Quat = [0, 0, 0, 1],
    Scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Transform;
        game.World.Transform[entity] = {
            EntityId: entity,
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
 * Get all component instances of a given type from the current entity and all
 * its children.
 *
 * @param world World object which stores the component data.
 * @param transform The transform to traverse.
 * @param component Component data array.
 * @param mask Component mask to look for.
 */
export function* components_of_type<T>(
    world: World,
    entity: Entity,
    component: Array<T>,
    mask: Has
): IterableIterator<T> {
    if (world.Mask[entity] & mask) {
        yield component[entity];
    }
    for (let child of world.Transform[entity].Children) {
        yield* components_of_type(world, child, component, mask);
    }
}
