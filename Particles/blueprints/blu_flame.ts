import {Cube} from "../../shapes/Cube.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {render_particles} from "../components/com_render_particles.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {shake} from "../components/com_shake.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_flame(game: Game) {
    return <Blueprint>{
        Children: [
            {
                Using: [render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1])],
            },
            {
                Translation: [0, 1, 0],
                Scale: [0.5, 0.5, 0.5],
                Children: [
                    {
                        Using: [
                            emit_particles(1, 0.15),
                            render_particles([1, 1, 0], 20, [1, 0, 0], 5),
                            shake(Infinity),
                        ],
                    },
                ],
            },
        ],
    };
}
