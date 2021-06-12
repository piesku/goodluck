import {from_euler} from "../../common/quat.js";
import {camera_forward_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_camera} from "../components/com_control_camera.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return [
        control_camera(100, 0, 1, 0),
        move(100, 0.2),
        children([
            transform(undefined, from_euler([0, 0, 0, 0], -30, 0, 0)),
            control_camera(0, 0, 0, 1),
            move(0, 0.2),
            children([
                transform([0, 100, 0], from_euler([0, 0, 0, 0], -90, 180, 0)),
                control_camera(0, 100, 0, 0),
                move(200, 0),
                camera_forward_perspective(1, 1, 1000),
            ]),
        ]),
    ];
}
