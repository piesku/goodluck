import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Trigger {
    Action: Action;
}

export function trigger(Action: Action) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Trigger;
        game[Get.Trigger][entity] = <Trigger>{
            Action,
        };
    };
}
