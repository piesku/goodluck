import {camera_forward_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {mimic} from "../components/com_mimic.js";
import {find_first} from "../components/com_named.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_follow(game: Game) {
    return [
        mimic(find_first(game.World, "camera anchor")),
        children([
            transform([0, 1, -6], [0, 1, 0, 0]),
            camera_forward_perspective(1, 0.1, 1000, [0.1, 0.5, 0.8, 1]),
        ]),
    ];
}
