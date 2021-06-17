import {Entity} from "../common/world.js";
import {Game} from "./game.js";

export const enum Action {
    Alert,
}

export function dispatch(game: Game, action: Action, payload: unknown) {
    switch (action) {
        case Action.Alert: {
            let [trigger, other] = payload as [Entity, Entity];
            alert(`Trigger #${trigger} activated by entity #${other}!`);
            break;
        }
    }
}
