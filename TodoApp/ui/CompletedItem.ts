import {html} from "../../lib/html.js";

export function CompletedItem(content: string) {
    return html`
        <li>
            <span
                style="
                    color: #999;
                    text-decoration: line-through;
                "
            >
                ${content}
            </span>
        </li>
    `;
}
