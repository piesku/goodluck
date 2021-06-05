import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {render_colored_shaded} from "../components/com_render1.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";
import {Blueprint} from "../impl.js";

export function blueprint_obstacle(game: Game): Blueprint {
    return [
        collide(true, Layer.Obstacle, Layer.Terrain | Layer.Player),
        rigid_body(RigidKind.Dynamic, 0.3),
        children([
            transform(),
            render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [0.5, 0.5, 0.5, 1]),
        ]),
    ];
}
