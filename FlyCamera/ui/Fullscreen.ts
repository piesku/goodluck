import {html} from "../../common/html.js";
import {Action} from "../actions.js";

export function Fullscreen() {
    return html`
        <div
            style="
                position: absolute;
                top: 1vmin;
                left: 1vmin;
                background: #000;
                color: #fff;
                font: 13px Arial;
            "
        >
            <button
                onclick="$(${Action.ToggleFullscreen})"
                style="
                padding: 1vmin;
                background: #000;
                color: #fff;
                border: none;
            "
            >
                ${document.fullscreenElement ? "Exit Fullscreen" : "Enter Fullscreen"}
            </button>
        </div>
    `;
}
