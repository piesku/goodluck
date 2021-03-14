import {camera_persp} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {transform} from "../components/com_transform.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game): Blueprint {
    return [children([transform(undefined, [0, 1, 0, 0]), camera_persp(1, 0.1, 1000)])];
}
