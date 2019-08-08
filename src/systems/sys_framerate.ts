import {Game} from "../game.js";

let counter = document.getElementById("fps");

export function sys_framerate(game: Game, delta: number) {
    if (counter) {
        let frame_rate = (1 / delta).toFixed(0);
        counter.textContent = `${frame_rate} fps`;
    }
}
