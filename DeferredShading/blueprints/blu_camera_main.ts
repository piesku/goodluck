import {perspective} from "../../common/projection.js";
import {camera_target} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_main(game: Game) {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            // Clear color must be black to not leak into the g-buffer.
            camera_target(game.Targets.Gbuffer, perspective(1, 0.1, 1000), [0, 0, 0, 0]),
        ]),
    ];
}
