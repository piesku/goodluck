import {Game} from "./game.js";

export const enum Action {
    EnterVr,
    ExitVr,
}

export function dispatch(game: Game, action: Action, args: unknown) {
    switch (action) {
        case Action.EnterVr: {
            if (game.XrSupported) {
                game.EnterXR();
            }
            break;
        }
        case Action.ExitVr: {
            if (game.XrFrame) {
                game.XrFrame.session.end();
            }
            break;
        }
    }
}
