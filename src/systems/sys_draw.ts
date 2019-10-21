import {DrawKind, DrawMarker} from "../components/com_draw.js";
import {Get, Has} from "../components/com_index.js";
import {Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";

const QUERY = Has.Transform | Has.Draw;

export function sys_draw(game: Game, delta: number) {
    game.Context2D.resetTransform();
    game.Context2D.clearRect(0, 0, game.ViewportWidth, game.ViewportHeight);
    let position = <Vec3>[0, 0, 0];

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            // World position.
            get_translation(position, game[Get.Transform][i].World);
            // NDC position.
            transform_point(position, position, game.Cameras[0].PV);

            game.Context2D.setTransform(
                1,
                0,
                0,
                1,
                0.5 * (position[0] + 1) * game.ViewportWidth,
                0.5 * (-position[1] + 1) * game.ViewportHeight
            );

            let draw = game[Get.Draw][i];
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
    game.Context2D.fillStyle = "#fff";
    game.Context2D.fillText(draw.Marker, 0, 0);
}
