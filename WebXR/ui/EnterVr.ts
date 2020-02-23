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
            ${window.isSecureContext
                ? navigator.xr
                    ? game.XrSupported
                        ? Button()
                        : `<div style="padding: 1vmin">WebXR headset not found</div>`
                    : `<div style="padding: 1vmin">WebXR not supported</div>`
                : `<div style="padding: 1vmin">WebXR requires HTTPS</div>`}
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
            Enter VR
        </button>
    `;
}
