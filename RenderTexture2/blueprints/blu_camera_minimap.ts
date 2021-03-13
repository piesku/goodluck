import {camera_framebuffer_perspective} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_camera_minimap(game: Game): Blueprint {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_framebuffer_perspective(
                1,
                0.1,
                1000,
                game.Textures.MinimapRgba,
                game.Textures.MinimapDepth,
                256,
                256,
                [0, 0, 1, 1]
            ),
        ]),
    ];
}
