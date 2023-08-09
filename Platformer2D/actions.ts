import {Game} from "./game.js";

export const enum Action {
    NoOp,
}

export function dispatch(game: Game, action: Action, payload: unknown) {
    switch (action) {
        case Action.NoOp: {
            break;
        }
    }
}
