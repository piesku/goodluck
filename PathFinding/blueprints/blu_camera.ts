import {perspective} from "../../common/projection.js";
import {from_euler} from "../../common/quat.js";
import {camera_canvas} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_dolly} from "../components/com_control_dolly.js";
import {control_player} from "../components/com_control_player.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return [
        control_player(true, 1, 0),
        control_dolly(100),
        move(100, 0.2),
        children([
            transform(undefined, from_euler([0, 0, 0, 0], -30, 0, 0)),
            control_player(false, 0, 1, -85, 0),
            control_dolly(0),
            move(0, 0.2),
            children([
                transform([0, 100, 0], from_euler([0, 0, 0, 0], -90, 180, 0)),
                control_player(false, 0, 0),
                control_dolly(200),
                move(200, 0),
                camera_canvas(perspective(1, 1, 1000)),
            ]),
        ]),
    ];
}
