import {Game} from "./game.js";

export const enum Action {
    Alert,
}

export function dispatch(game: Game, action: Action, payload: unknown) {
    switch (action) {
        case Action.Alert: {
            alert("Trigger activated!");
            break;
        }
    }
}
