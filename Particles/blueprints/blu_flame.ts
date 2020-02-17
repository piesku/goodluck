import {emit_particles} from "../components/com_emit_particles.js";
import {render_particles} from "../components/com_render_particles.js";
import {shake} from "../components/com_shake.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_flame(game: Game) {
    return <Blueprint>{
        Children: [
            {
                Using: [
                    emit_particles(1, 0.05),
                    render_particles([1, 1, 0], 20, [1, 0, 0], 5),
                    shake(Infinity),
                ],
            },
        ],
    };
}
