import {Game} from "./game.js";

export const enum Action {
    AddTodo,
    CompleteTodo,
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
        case Action.CompleteTodo: {
            let idx = payload as number;
            if (idx < game.Todos.length) {
                let removed = game.Todos.splice(idx, 1);
                game.Completed.push(...removed);
            }
            break;
        }
    }
}
