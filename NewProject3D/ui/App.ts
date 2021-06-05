import {html} from "../../common/html.js";
import {Game} from "../game.js";
import {Fullscreen} from "./Fullscreen.js";

export function App(game: Game) {
    return html`<div>${Fullscreen()}</div>`;
}
