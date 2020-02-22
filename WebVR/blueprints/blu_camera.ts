import {camera_persp, camera_vr, Eye} from "../components/com_camera.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return <Blueprint>{
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [camera_persp(1, 0.1, 1000)],
            },
            {
                Using: [camera_vr(Eye.Left)],
            },
            {
                Using: [camera_vr(Eye.Right)],
            },
        ],
    };
}
