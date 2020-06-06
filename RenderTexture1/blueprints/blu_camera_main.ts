import {camera_display} from "../components/com_camera_display.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_camera_main(game: Game) {
    return <Blueprint>{
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [camera_display(1, 0.1, 1000, [0.9, 0.9, 0.9, 1])],
            },
        ],
    };
}
