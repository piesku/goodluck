/**
 * @module components/com_control_always
 */

import {Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlAlways2D {
    Direction: Vec2 | null;
    Rotation: number;
}

export function control_always2d(direction: Vec2 | null, rotation: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlAlways2D;
        game.World.ControlAlways2D[entity] = {
            Direction: direction,
            Rotation: rotation,
        };
    };
}
