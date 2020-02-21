import {camera} from "../components/com_camera.js";
import {mimic} from "../components/com_mimic.js";
import {find_first} from "../components/com_named.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_camera_follow(game: Game) {
    return <Blueprint>{
        Translation: [0, 1000, 1000],
        Rotation: [0, 1, 0, 0],
        Using: [mimic(find_first(game.World, "camera anchor"))],
        Children: [
            {
                // camera
                Translation: [0, 1, -6],
                Rotation: [0, 1, 0, 0],
                Using: [camera(1, 0.1, 1000)],
            },
        ],
    };
}
