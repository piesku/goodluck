import {create} from "../../common/mat4.js";
import {Mat4, Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
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
    readonly Entity: Entity;
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
            Entity: entity,
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
