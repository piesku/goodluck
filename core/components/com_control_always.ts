/**
 * @module components/com_control_always
 */

import {Quat, Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlAlways {
    Direction: Vec3 | null;
    Rotation: Quat | null;
}

export function control_always(direction: Vec3 | null, rotation: Quat | null) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlAlways;
        game.World.ControlAlways[entity] = {
            Direction: direction,
            Rotation: rotation,
        };
    };
}
