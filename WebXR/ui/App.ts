import {html} from "../../lib/html.js";
import {Game} from "../game.js";
import {EnterVr} from "./EnterVr.js";

export function App(game: Game) {
    return html` <div>${EnterVr(game)}</div> `;
}
