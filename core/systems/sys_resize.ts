/**
 * @module systems/sys_resize
 */

import {Game} from "../game.js";

export function sys_resize(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth = game.Canvas3D.width = game.Canvas2D.width = window.innerWidth;
        game.ViewportHeight = game.Canvas3D.height = game.Canvas2D.height = window.innerHeight;
    }
}
