import {Entity, Game} from "../game.js";
import {Mat4, Quat, Vec3} from "../math/index.js";
import {create} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Transform {
    /** Absolute matrix relative to the world. */
    world: Mat4;
    /** World to self matrix. */
    self: Mat4;
    /** Local translation relative to the parent. */
    translation: Vec3;
    /** Local rotation relative to the parent. */
    rotation: Quat;
    /** Local scale relative to the parent. */
    scale: Vec3;
    /** This Transform's entity id. */
    readonly entity: Entity;
    parent?: Transform;
    children: Array<Transform>;
    dirty: boolean;
}

export function transform(
    translation: Vec3 = [0, 0, 0],
    rotation: Quat = [0, 0, 0, 1],
    scale: Vec3 = [1, 1, 1]
) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Transform;
        game[Get.Transform][entity] = <Transform>{
            entity,
            world: create(),
            self: create(),
            translation,
            rotation,
            scale,
            children: [],
            dirty: true,
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
    if (game.world[transform.entity] & (1 << component)) {
        yield (game[component][transform.entity] as unknown) as T;
    }
    for (let child of transform.children) {
        yield* components_of_type<T>(game, child, component);
    }
}
