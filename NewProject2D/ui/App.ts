import {html} from "../../lib/html.js";
import {Game} from "../game.js";
import {SQUARE_LIFESPAN} from "../scenes/blu_square.js";

export function App(game: Game) {
    return html`
        <div style="margin: 10px;">
            <h1 style="float: left; margin-right: 10px;">NewProject2D</h1>
            <div>Click to spawn new squares.</div>
            <div>Use the arrow keys to move all squares at once.</div>
            <div>A square lives for ${SQUARE_LIFESPAN} seconds.</div>
        </div>
    `;
}
