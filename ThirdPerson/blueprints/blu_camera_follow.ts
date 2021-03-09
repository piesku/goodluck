import {camera_display_perspective} from "../components/com_camera.js";
import {mimic} from "../components/com_mimic.js";
import {find_first} from "../components/com_named.js";
import {Blueprint3D} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_camera_follow(game: Game): Blueprint3D {
    return {
        Translation: [0, 1000, 1000],
        Rotation: [0, 1, 0, 0],
        Using: [mimic(find_first(game.World, "camera anchor"))],
        Children: [
            {
                // camera
                Translation: [0, 1, -6],
                Rotation: [0, 1, 0, 0],
                Using: [camera_display_perspective(1, 0.1, 1000)],
            },
        ],
    };
}
