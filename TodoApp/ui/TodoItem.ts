import {html} from "../../common/html.js";
import {Action} from "../actions.js";

export function TodoItem(content: string, idx: number) {
    return html`
        <li>
            <span>${content}</span>
            <small
                onclick="$(${Action.CompleteTodo}, ${idx})"
                style="
                    color: #00f;
                    text-decoration: underline;
                    cursor: pointer;
                "
            >
                complete
            </small>
        </li>
    `;
}
