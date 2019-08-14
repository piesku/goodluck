import {camera} from "../components/com_camera.js";
import {move} from "../components/com_move.js";
import {player_control} from "../components/com_player_control.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common";

export let fly_camera_blueprint: Blueprint = {
    rotation: [0, 1, 0, 0],
    using: [player_control(true, true, true), move(10, 0.2)],
    children: [
        {
            rotation: [0, 1, 0, 0],
            using: [
                (game: Game) => camera(game.canvas.width / game.canvas.height, 1, 0.1, 1000)(game),
            ],
        },
    ],
};
