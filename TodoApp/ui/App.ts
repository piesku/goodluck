import {Game} from "../game.js";
import {AddForm} from "./AddForm.js";
import {html} from "./html.js";
import {TodoItem} from "./TodoItem.js";

export function App(game: Game) {
    return html`
        <div style="padding: 20px; font: 14px Arial, sans-serif;">
            <h1>Todo App</h1>
            <div style="display: flex;">
                <div style="flex: 1;">
                    <ul>
                        ${game.Todos.map(TodoItem)}
                    </ul>
                    <div>
                        ${AddForm()}
                    </div>
                </div>
            </div>
        </div>
    `;
}
