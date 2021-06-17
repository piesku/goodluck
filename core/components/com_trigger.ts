/**
 * @module components/com_trigger
 */

import {Entity} from "../../common/world.js";
import {Action} from "../actions.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export interface Trigger {
    Mask: Layer;
    Action: Action;
}

export function trigger(mask: Layer, action: Action) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Trigger;
        game.World.Trigger[entity] = {
            Mask: mask,
            Action: action,
        };
    };
}
