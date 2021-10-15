import {camera_forward_ortho} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return [children([transform(undefined, [0, 1, 0, 0]), camera_forward_ortho(2, 1, 100)])];
}
