import {Game} from "../game.js";

let tick_span = document.getElementById("tick");
let fps_span = document.getElementById("fps");

export function sys_framerate(game: Game, delta: number) {
    if (tick_span) {
        tick_span.textContent = (delta * 1000).toFixed(1);
    }
    if (fps_span) {
        fps_span.textContent = (1 / delta).toFixed();
    }
}
