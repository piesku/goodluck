import {camera_framebuffer_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_camera_main(game: Game): Blueprint {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_framebuffer_perspective(game.Targets.Gbuffer, 1, 0.1, 1000, [0.5, 0.5, 0.5, 1]),
        ]),
    ];
}
