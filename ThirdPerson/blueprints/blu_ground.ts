import {float} from "../../common/random.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {transform} from "../components/com_transform.js";
import {Blueprint} from "../entity.js";
import {Game, Layer} from "../game.js";

export function blueprint_ground(game: Game): Blueprint {
    return [
        collide(false, Layer.Terrain, Layer.None),
        rigid_body(RigidKind.Static),
        children([
            transform([0, float(-0.2, 0.2), 0]),
            render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [
                1,
                1,
                0.3,
                1,
            ]),
        ]),
    ];
}
