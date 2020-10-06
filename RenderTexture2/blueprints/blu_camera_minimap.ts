import {camera_framebuffer_perspective} from "../components/com_camera.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_camera_minimap(game: Game): Blueprint {
    return {
        // 90x, 0y, 0z
        Rotation: [0.707, 0, 0, 0.707],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [
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
                ],
            },
        ],
    };
}
