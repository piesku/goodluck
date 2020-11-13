import {from_euler} from "../../common/quat.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {render_particles_textured} from "../components/com_render.js";
import {shake} from "../components/com_shake.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_flame_textured(game: Game): Blueprint {
    return {
        Children: [
            {
                Rotation: from_euler([0, 0, 0, 0], -90, 0, 0),
                Using: [
                    emit_particles(2, 0.05, 2.5),
                    render_particles_textured(
                        game.Textures["fire"],
                        [1, 1, 1, 1],
                        20,
                        [0.9, 0.9, 0.9, 1],
                        5
                    ),
                    shake(Infinity),
                ],
            },
        ],
    };
}
