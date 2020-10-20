import {create} from "../../common/mat4.js";
import {Mat4, Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
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
    Children: Array<Entity>;
    Dirty: boolean;
}

export function transform(
    Translation: Vec3 = [0, 0, 0],
    Rotation: Quat = [0, 0, 0, 1],
    Scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform;
        game.World.Transform[entity] = {
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
    if (world.Signature[parent] & mask) {
        yield parent;
    }
    for (let child of world.Transform[parent].Children) {
        yield* query_all(world, child, mask);
    }
}

/**
 * Anchor an entity as a child of another entity. The previous parent-child
 * relationship of the entity will be severed, if it exists.
 *
 * @param world The World object with component data.
 * @param parent The parent at which to anchor the entity.
 * @param child The entity to anchor at the specified parent.
 */
export function reparent(world: World, parent: Entity, child: Entity) {
    let child_transform = world.Transform[child];
    let prev_parent = child_transform.Parent;
    if (prev_parent !== undefined) {
        let prev_siblings = world.Transform[prev_parent].Children;
        let child_index = prev_siblings.indexOf(child);
        if (child_index > -1) {
            prev_siblings.splice(child_index, 1);
        }
    }

    child_transform.Parent = parent;

    let parent_transform = world.Transform[parent];
    parent_transform.Children.push(child);
}
