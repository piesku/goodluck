import {GL_CCW, GL_CW} from "../../common/webgl.js";
import {camera_xr} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {ControlXrKind, control_xr} from "../components/com_control_xr.js";
import {render_colored_shaded} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_viewer(game: Game) {
    return [
        children(
            [
                // Headset.
                transform(),
                camera_xr([0.9, 0.9, 0.9, 1]),
            ],
            [
                // Left hand.
                transform(),
                control_xr(ControlXrKind.Left),
                children([
                    // Hand mesh; must be Children[0].
                    transform(undefined, undefined, [-1, 1, 1]),
                    render_colored_shaded(
                        game.MaterialColoredGouraud,
                        game.MeshHand,
                        [1, 1, 0.3, 1],
                        0,
                        0,
                        [1, 1, 1],
                        GL_CCW
                    ),
                ]),
            ],
            [
                // Right hand.
                transform(),
                control_xr(ControlXrKind.Right),
                children([
                    // Hand mesh; must be Children[0].
                    transform(),
                    render_colored_shaded(
                        game.MaterialColoredGouraud,
                        game.MeshHand,
                        [1, 1, 0.3, 1],
                        0,
                        0,
                        [1, 1, 1],
                        GL_CW
                    ),
                ]),
            ]
        ),
    ];
}
