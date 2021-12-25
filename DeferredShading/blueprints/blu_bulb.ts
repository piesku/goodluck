import {Vec3, Vec4} from "../../common/math.js";
import {from_euler} from "../../common/quat.js";
import {element, float} from "../../common/random.js";
import {scale} from "../../common/vec4.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_deferred} from "../components/com_render.js";
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
    // TODO: Auto-compute from the light's range.
    let diameter = (range ** 2 / 0.02) ** 0.5 * 2;
    let light_color = element(colors);
    let bulb_color: Vec4 = [...light_color, 1];
    // TODO(stasm): Implement emissive lighting.
    scale(bulb_color, bulb_color, 5);
    return [
        control_always(null, from_euler([0, 0, 0, 1], float(0, 360), float(0, 360), float(0, 360))),
        move(0, float()),
        children([
            transform([0, 0, float(1, 5)]),
            children(
                [
                    transform(undefined, undefined, [diameter, diameter, diameter]),
                    light_point(light_color, range),
                ],
                [
                    transform(undefined, undefined, [0.1, 0.1, 0.1]),
                    render_colored_deferred(
                        game.MaterialColored,
                        game.MeshSphereSmooth,
                        bulb_color
                    ),
                ]
            ),
        ]),
    ];
}
