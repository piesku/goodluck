import {Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Rotate {
    /** Eulers per second on each axis */
    Rotation: Vec3;
}

export function rotate(rotation: Vec3) {
    return (game: Game, EntityId: Entity) => {
        game.World.Mask[EntityId] |= Has.Rotate;
        game.World.Rotate[EntityId] = {
            Rotation: rotation,
        };
    };
}
