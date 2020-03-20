import {Game} from "./game.js";

export const enum Action {
    AddTodo,
}

export function dispatch(game: Game, action: Action, payload: unknown) {
    switch (action) {
        case Action.AddTodo: {
            let todo = payload as string;
            if (todo) {
                game.Todos.push(todo);
            }
            break;
        }
    }
}
