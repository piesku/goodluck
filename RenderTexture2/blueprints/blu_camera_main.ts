import {camera_display_perspective} from "../components/com_camera.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_camera_main(game: Game): Blueprint {
    return {
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [camera_display_perspective(1, 0.1, 1000, [0.9, 0.9, 0.9, 1])],
            },
        ],
    };
}
