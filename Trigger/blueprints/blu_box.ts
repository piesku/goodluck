import {collide} from "../components/com_collide.js";
import {render_colored_shaded} from "../components/com_render1.js";
import {Game, Layer} from "../game.js";
import {Blueprint} from "../impl.js";

export function blueprint_box(game: Game): Blueprint {
    return [
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        collide(true, Layer.Default, Layer.None),
    ];
}
