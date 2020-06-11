import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Trigger {
    Action: Action;
}

export function trigger(Action: Action) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Trigger;
        game.World.Trigger[entity] = {
            Action,
        };
    };
}
