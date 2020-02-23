import {camera_vr, Eye} from "../components/com_camera.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_viewer(game: Game) {
    return <Blueprint>{
        Children: [
            {
                Using: [camera_vr(Eye.Left)],
            },
            {
                Using: [camera_vr(Eye.Right)],
            },
        ],
    };
}
