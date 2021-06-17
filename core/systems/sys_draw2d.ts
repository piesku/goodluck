/**
 * @module systems/sys_draw2d
 */

import {DrawKind, DrawRect} from "../components/com_draw.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.Draw;

export function sys_draw2d(game: Game, delta: number) {
    game.Context2D.resetTransform();
    game.Context2D.fillStyle = "#e6e6e6";
    game.Context2D.fillRect(0, 0, game.ViewportWidth, game.ViewportHeight);

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            let transform = game.World.Transform2D[i];
            game.Context2D.setTransform(
                transform.World[0],
                transform.World[1],
                transform.World[2],
                transform.World[3],
                transform.World[4],
                transform.World[5]
            );

            let draw = game.World.Draw[i];
            switch (draw.Kind) {
                case DrawKind.Rect:
                    draw_rect(game, draw);
                    break;
            }
        }
    }
}

function draw_rect(game: Game, draw: DrawRect) {
    game.Context2D.fillStyle = draw.Color;
    game.Context2D.fillRect(-draw.Width / 2, -draw.Height / 2, draw.Width, draw.Height);
}
