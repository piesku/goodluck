import {Action} from "../actions.js";
import {Game} from "../game.js";
import {html} from "./html.js";

export function EnterVr(game: Game) {
    return html`
        <div
            style="
                position: absolute;
                bottom: 1vmin;
                right: 1vmin;
                background: #000;
                color: #fff;
                font: 13px Arial;
            "
        >
            ${navigator.getVRDisplays
                ? game.VrDisplay
                    ? Button()
                    : `<div style="padding: 1vmin">WebVR headset not found</div>`
                : `<div style="padding: 1vmin">WebVR not supported</div>`}
        </div>
    `;
}

function Button() {
    return html`
        <button
            onclick="$(${Action.EnterVr})"
            style="
                padding: 1vmin;
                background: #000;
                color: #fff;
                border: none;
            "
        >
            Enter WebVR
        </button>
    `;
}
