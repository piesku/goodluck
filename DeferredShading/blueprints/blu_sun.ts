import {orthographic} from "../../common/projection.js";
import {from_euler} from "../../common/quat.js";
import {camera_target} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_ambient, light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_sun(game: Game) {
    return [
        control_always(null, [0, 1, 0, 0]),
        move(0, 0.5),
        children(
            // Main light.
            [
                transform([0, 0, 20]),
                light_directional([1, 1, 1], 0.1),
                camera_target(game.Targets.Sun, orthographic(15, 1, 100)),
            ],
            // Secondary light, from the other side of the scene.
            [
                transform([0, 20, 0], from_euler([0, 0, 0, 1], -90, 0, 0)),
                light_directional([1, 1, 1], 0.05),
                camera_target(game.Targets.Back, orthographic(15, 1, 100)),
            ],
            // Ambient light.
            [transform(), light_ambient([1, 1, 1], 0.01)]
        ),
    ];
}
