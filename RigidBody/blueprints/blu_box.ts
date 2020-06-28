import {collide} from "../components/com_collide.js";
import {lifespan} from "../components/com_lifespan.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../core.js";
import {Game, Layer} from "../game.js";

export function blueprint_box(game: Game): Blueprint {
    return {
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 0.3, 0, 1]),
            collide(true, Layer.Physics, Layer.Terrain | Layer.Physics),
            rigid_body(true),
            lifespan(7),
        ],
    };
}
