import {html} from "../../common/html.js";
import {Action} from "../actions.js";
import {Game} from "../game.js";

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
            ${game.VrDisplay?.isPresenting
                ? ExitButton()
                : typeof navigator.getVRDisplays === "function"
                ? game.VrDisplay
                    ? EnterButton()
                    : `<div style="padding: 1vmin">WebVR headset not found</div>`
                : `<div style="padding: 1vmin">WebVR not supported</div>`}
        </div>
    `;
}

function EnterButton() {
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

function ExitButton() {
    return html`
        <button
            onclick="$(${Action.ExitVr})"
            style="
                padding: 1vmin;
                background: #000;
                color: #fff;
                border: none;
            "
        >
            Exit VR
        </button>
    `;
}
