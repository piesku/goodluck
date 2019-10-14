import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Trigger {
    Action: Action;
}

export function trigger(Action: Action) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Trigger;
        game[Get.Trigger][entity] = <Trigger>{
            Action,
        };
    };
}
