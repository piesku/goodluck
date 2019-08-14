import {ColorToggle} from "./ColorToggle.js";
import {html} from "./html.js";
import {UIState} from "./state.js";

export function App(state: UIState) {
    return html`
        <div
            style="
                position: absolute;
                top: 0;
                background-color: #000;
                color: #fff;
            "
        >
            ${ColorToggle()}
        </div>
    `;
}
