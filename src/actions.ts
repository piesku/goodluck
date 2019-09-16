import {Game} from "./game.js";

export const enum Action {
    ToggleClearColor,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ToggleClearColor: {
            game.GL.clearColor(...game.UI.clear_color);
        }
    }
}
