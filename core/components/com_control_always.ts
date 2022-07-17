/**
 * @module components/com_control_always
 */

import {Quat, Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";
import {Animate} from "./com_animate.js";

export interface ControlAlways {
    Direction: Vec3 | null;
    Rotation: Quat | null;
    Animation: Animate["Trigger"];
}

export function control_always(
    direction: Vec3 | null,
    rotation: Quat | null,
    animation?: Animate["Trigger"]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlAlways;
        game.World.ControlAlways[entity] = {
            Direction: direction,
            Rotation: rotation,
            Animation: animation,
        };
    };
}
