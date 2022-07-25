/**
 * @module components/com_local2d
 */

import {Deg, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Local2D {
    /** Local translation relative to the parent. */
    Translation: Vec2;
    /** Local rotation relative to the parent. */
    Rotation: Deg;
    /** Local scale relative to the parent. */
    Scale: Vec2;
}

export function local2d(translation: Vec2 = [0, 0], rotation: Deg = 0, scale: Vec2 = [1, 1]) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Local2D | Has.Dirty;
        game.World.Local2D[entity] = {
            Translation: translation,
            Rotation: rotation,
            Scale: scale,
        };
    };
}
