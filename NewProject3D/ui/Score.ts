import {html} from "../../common/html.js";
import {Game} from "../game.js";

export function Score(game: Game) {
    return html`
        <div
            style="
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 10vmin;

                display: flex;
                justify-content: space-around;
                align-items: center;

                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                font: 24px Impact;
                font-style: italic;
            "
        >
            <div>Collected: ${game.ItemsCollected}</div>
            <div>Missed: ${game.ItemsMissed}</div>
        </div>
    `;
}
