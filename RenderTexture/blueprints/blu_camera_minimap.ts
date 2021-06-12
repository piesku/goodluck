import {camera_framebuffer_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_minimap(game: Game) {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_framebuffer_perspective(game.Targets.Minimap, 1, 0.1, 1000, [0, 0, 1, 1]),
        ]),
    ];
}
