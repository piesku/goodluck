import {Game} from "../game.js";

export function sys_resize(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth = game.Canvas.width = game.Billboard.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = game.Billboard.height = window.innerHeight;
    }
}
