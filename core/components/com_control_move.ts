import {Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlMove {
    Direction: Vec3 | null;
    Rotation: Quat | null;
}

export function control_move(direction: Vec3 | null, rotation: Quat | null) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlMove;
        game.World.ControlMove[entity] = {
            Direction: direction,
            Rotation: rotation,
        };
    };
}
