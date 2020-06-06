import {collide} from "../components/com_collide.js";
import {lifespan} from "../components/com_lifespan.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_box(game: Game) {
    return <Blueprint>{
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 0.3, 0, 1]),
            collide(true),
            rigid_body(true),
            lifespan(7),
        ],
    };
}
