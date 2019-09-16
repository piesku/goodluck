import {Game} from "./game.js";
import {Vec4} from "./math/index.js";

export interface GameState {
    ClearColor: Vec4;
}

export const enum Action {
    ToggleClearColor,
}

export function dispatch(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ToggleClearColor: {
            game.ClearColor = [
                1 - game.ClearColor[0],
                1 - game.ClearColor[1],
                1 - game.ClearColor[2],
                game.ClearColor[3],
            ];
            game.GL.clearColor(
                game.ClearColor[0],
                game.ClearColor[1],
                game.ClearColor[2],
                game.ClearColor[3]
            );
            break;
        }
    }
}
