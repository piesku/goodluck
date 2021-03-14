import {collide} from "../components/com_collide.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {Blueprint} from "../entity.js";
import {Game, Layer} from "../game.js";

export function blueprint_box(game: Game): Blueprint {
    return [
        render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        collide(true, Layer.Default, Layer.None),
    ];
}
