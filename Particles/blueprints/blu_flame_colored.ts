import {from_euler} from "../../common/quat.js";
import {children} from "../components/com_children.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {render_particles_colored} from "../components/com_render.js";
import {shake} from "../components/com_shake.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";

export function blueprint_flame_colored(game: Game) {
    return [
        children([
            transform(undefined, from_euler([0, 0, 0, 0], -90, 0, 0)),
            emit_particles(1, 0.05, 5),
            render_particles_colored([1, 1, 0, 1], 20, [1, 0, 0, 1], 5),
            shake(1),
        ]),
    ];
}
