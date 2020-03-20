import {html} from "./html.js";

export function TodoItem(content: string) {
    return html`
        <li>
            ${content}
        </li>
    `;
}
