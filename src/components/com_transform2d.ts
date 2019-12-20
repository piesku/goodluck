import {Entity, Game} from "../game.js";
import {Mat2D, Rad, Vec2} from "../math/index.js";
import {create} from "../math/mat2d.js";
import {Has} from "./com_index.js";

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
    /** This Transform's entity id. */
    readonly EntityId: Entity;
    Parent?: Transform2D;
    Children: Array<Transform2D>;
    Dirty: boolean;
}

export function transform2d(Translation: Vec2 = [0, 0], Rotation: Rad = 0, Scale: Vec2 = [1, 1]) {
    return (game: Game, EntityId: Entity) => {
        game.World.Mask[EntityId] |= Has.Transform2D;
        game.World.Transform2D[EntityId] = <Transform2D>{
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
