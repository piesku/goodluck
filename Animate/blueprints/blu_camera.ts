import {Blueprint} from "../../common/game.js";
import {camera_forward_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game): Blueprint<Game> {
    return [
        children([transform(undefined, [0, 1, 0, 0]), camera_forward_perspective(1, 0.1, 1000)]),
    ];
}
