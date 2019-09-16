import {Action} from "../actions.js";
import {html} from "./html.js";

export function ColorToggle() {
    return html`
        <button onclick="$(${Action.ToggleClearColor})">
            Toggle Clear Color
        </button>
    `;
}
