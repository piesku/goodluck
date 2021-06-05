import {Game} from "./game.js";

export const enum Action {
    ToggleFullscreen,
}

export function dispatch(game: Game, action: Action, args: unknown) {
    switch (action) {
        case Action.ToggleFullscreen: {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.body.requestFullscreen();
            }
            break;
        }
    }
}
