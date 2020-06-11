import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {transform_point} from "../../common/vec3.js";
import {DrawKind, DrawMarker} from "../components/com_draw.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Draw;

export function sys_draw(game: Game, delta: number) {
    game.Context2D.resetTransform();
    game.Context2D.clearRect(0, 0, game.ViewportWidth, game.ViewportHeight);
    let position = <Vec3>[0, 0, 0];

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            // World position.
            get_translation(position, game.World.Transform[i].World);
            // NDC position.
            transform_point(position, position, game.Camera!.Pv);

            game.Context2D.setTransform(
                1,
                0,
                0,
                1,
                0.5 * (position[0] + 1) * game.ViewportWidth,
                0.5 * (-position[1] + 1) * game.ViewportHeight
            );

            let draw = game.World.Draw[i];
            switch (draw.Kind) {
                case DrawKind.Marker:
                    draw_marker(game, draw);
                    break;
            }
        }
    }
}

function draw_marker(game: Game, draw: DrawMarker) {
    game.Context2D.font = "10vmin sans";
    game.Context2D.textAlign = "center";
    game.Context2D.fillStyle = "#555";
    game.Context2D.fillText(draw.Marker, 0, 0);
}
