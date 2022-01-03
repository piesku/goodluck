import {html} from "../../common/html.js";
import {Game} from "../game.js";

export function App(game: Game) {
    return html`<div style="color: #fff; font-size: 3rem; text-align: center; margin-top: 10%;">
        Point lights: ${game.LightCount}
    </div> `;
}
