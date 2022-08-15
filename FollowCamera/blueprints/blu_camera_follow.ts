import {perspective} from "../../lib/projection.js";
import {camera_canvas} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {follow} from "../components/com_follow.js";
import {look_at} from "../components/com_look_at.js";
import {first_named} from "../components/com_named.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_camera_follow(game: Game) {
    return [
        transform(),
        follow(first_named(game.World, "camera anchor"), 0.01),
        look_at(first_named(game.World, "player"), 0.01),
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_canvas(perspective(1, 0.1, 1000), [0.1, 0.5, 0.8, 1]),
        ]),
    ];
}
