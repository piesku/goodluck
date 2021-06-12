import {camera_deferred_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_main(game: Game) {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            // Clear color must be black to not leak into the g-buffer.
            camera_deferred_perspective(game.Targets.Gbuffer, 1, 0.1, 1000, [0, 0, 0, 1]),
        ]),
    ];
}
