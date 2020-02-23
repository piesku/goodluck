import {Game} from "../game.js";
import {EnterVr} from "./EnterVr.js";
import {html} from "./html.js";

export function App(game: Game) {
    return html`
        <div>
            ${EnterVr(game)}
        </div>
    `;
}
