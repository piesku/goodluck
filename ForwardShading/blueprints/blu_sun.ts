import {orthographic} from "../../common/projection.js";
import {camera_target} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_sun(game: Game) {
    return [
        control_always(null, [0, 1, 0, 0]),
        move(0, 0.5),
        children([
            transform([0, 0, 10]),
            light_directional([1, 1, 1], 0.3),
            camera_target(game.Targets.Sun, orthographic(10, 1, 100)),
        ]),
    ];
}
