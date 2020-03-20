import {Action} from "../actions.js";
import {html} from "./html.js";

export function AddForm() {
    return html`
        <input
            type="text"
            onkeypress="if (event.key === 'Enter') {
                $(${Action.AddTodo}, this.value);
            }"
        />
        <button onclick="$(${Action.AddTodo}, this.previousElementSibling.value)">
            Add
        </button>
    `;
}
