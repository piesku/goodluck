import {vr_present} from "./core.js";
import {Game} from "./game.js";

export const enum Action {
    EnterVr = 1,
}

export function dispatch(game: Game, action: Action, args: unknown) {
    switch (action) {
        case Action.EnterVr: {
            if (game.VrDisplay) {
                vr_present(game, game.VrDisplay);
            }
            break;
        }
    }
}
