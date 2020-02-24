import {camera_vr} from "../components/com_camera.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_viewer(game: Game) {
    return <Blueprint>{
        Using: [camera_vr()],
    };
}
