import {perspective} from "../../common/projection.js";
import {camera_target} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_minimap(game: Game) {
    return [
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_target(game.Targets.Minimap, perspective(1, 0.1, 1000), [0.5, 0.7, 0.9, 1]),
        ]),
    ];
}
