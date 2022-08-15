import {perspective} from "../../lib/projection.js";
import {camera_canvas} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return [
        transform(),
        children([transform(undefined, [0, 1, 0, 0]), camera_canvas(perspective(1, 0.1, 1000))]),
    ];
}
