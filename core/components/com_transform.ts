import {create} from "../../common/mat4.js";
import {Mat4, Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

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
    Dirty: boolean;
}

export function transform(
    translation: Vec3 = [0, 0, 0],
    rotation: Quat = [0, 0, 0, 1],
    scale: Vec3 = [1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Transform;
        game.World.Transform[entity] = {
            World: create(),
            Self: create(),
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
            Dirty: true,
        };
    };
}
