import {Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Rotate {
    /** Eulers per second on each axis */
    Rotation: Vec3;
}

export function rotate(rotation: Vec3) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Rotate;
        game.World.Rotate[entity] = {
            Rotation: rotation,
        };
    };
}
