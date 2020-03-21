import {collide} from "../components/com_collide.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_box(game: Game) {
    return <Blueprint>{
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
            collide(true),
        ],
    };
}
