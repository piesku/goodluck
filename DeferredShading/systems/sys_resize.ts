import {resize_deferred_target} from "../../common/framebuffer.js";
import {Game} from "../game.js";

export function sys_resize(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;

        resize_deferred_target(
            game.Gl,
            game.Targets.Gbuffer,
            game.ViewportWidth,
            game.ViewportHeight
        );
    }
}
