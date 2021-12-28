import {perspective} from "../../common/projection.js";
import {camera_canvas} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_player} from "../components/com_control_player.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_fly(game: Game) {
    return [
        control_player(true, 0.1, 0.1, -89, 89),
        move(10, 2),
        children([transform(undefined, [0, 1, 0, 0]), camera_canvas(perspective(1, 0.1, 1000))]),
    ];
}
