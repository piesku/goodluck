import {xr_enter} from "./core.js";
import {Game} from "./game.js";

export const enum Action {
    EnterVr = 1,
}

export function dispatch(game: Game, action: Action, args: unknown) {
    switch (action) {
        case Action.EnterVr: {
            if (game.XrSupported) {
                xr_enter(game);
            }
            break;
        }
    }
}
