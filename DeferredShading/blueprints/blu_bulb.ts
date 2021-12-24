import {Vec3} from "../../common/math.js";
import {element, float} from "../../common/random.js";
import {children} from "../components/com_children.js";
import {light_point} from "../components/com_light.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const colors: Array<Vec3> = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
];

export function blueprint_bulb(game: Game) {
    let range = float(0.5, 1.5);
    // TODO: Auto-compute scale from the light's range.
    let scale = (range ** 2 / 0.02) ** 0.5 * 2;
    return [
        children([
            transform(undefined, undefined, [scale, scale, scale]),
            light_point(element(colors), range),
        ]),
    ];
}
