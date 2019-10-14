import {Entity, Game} from "../game.js";
import {Mat4, Quat, Vec3} from "../math/index.js";
import {create} from "../math/mat4.js";
import {Get, Has} from "./com_index.js";

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
    Parent?: Transform;
    Children: Array<Transform>;
    Dirty: boolean;
}

export function transform(
    Translation: Vec3 = [0, 0, 0],
    Rotation: Quat = [0, 0, 0, 1],
    Scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, EntityId: Entity) => {
        game.World[EntityId] |= Has.Transform;
        game[Get.Transform][EntityId] = <Transform>{
            EntityId,
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
 * @param game Game object which stores the component data.
 * @param transform The transform to traverse.
 * @param component Component mask to look for.
 */
export function* components_of_type<T>(
    game: Game,
    transform: Transform,
    component: Get
): IterableIterator<T> {
    if (game.World[transform.EntityId] & (1 << component)) {
        yield (game[component][transform.EntityId] as unknown) as T;
    }
    for (let child of transform.Children) {
        yield* components_of_type<T>(game, child, component);
    }
}
