import {camera} from "../components/com_camera.js";
import {pick} from "../components/com_pick.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game): Blueprint {
    return {
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [camera(1, 0.1, 1000), pick()],
            },
        ],
    };
}
