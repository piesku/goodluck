import {camera_display_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Blueprint} from "../impl.js";

export function blueprint_camera(game: Game): Blueprint {
    return [
        children([transform(undefined, [0, 1, 0, 0]), camera_display_perspective(1, 0.1, 1000)]),
    ];
}
