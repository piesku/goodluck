/**
 * @module components/com_toggle
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Toggle {
    Mask: number;
    Frequency: number;
    SinceLast: number;
    CurrentlyEnabled: boolean;
}

export function toggle(mask: number, frequency: number, init: boolean) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Toggle;
        game.World.Toggle[entity] = {
            Mask: mask,
            Frequency: frequency,
            SinceLast: frequency,
            CurrentlyEnabled: !init,
        };
    };
}
