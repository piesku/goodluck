import {collide} from "../components/com_collide.js";
import {lifespan} from "../components/com_lifespan.js";
import {render_colored_shaded} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";

export function blueprint_box(game: Game) {
    return [
        transform(),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 0.3, 0, 1]),
        collide(true, Layer.Physics, Layer.Terrain | Layer.Physics),
        rigid_body(RigidKind.Dynamic),
        lifespan(7),
    ];
}
