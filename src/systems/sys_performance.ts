import {Game} from "../game.js";

export function sys_performance(game: Game, delta: number, target: HTMLElement | null) {
    if (target) {
        target.textContent = delta.toFixed(1);
    }
}
