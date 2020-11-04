import {float} from "../../common/random.js";
import {collide} from "../components/com_collide.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../entity.js";
import {Game, Layer} from "../game.js";

export function blueprint_ground(game: Game, size: number): Blueprint {
    return {
        Scale: [size, 1, size],
        Using: [collide(false, Layer.Terrain, Layer.None), rigid_body(false)],
        Children: [
            {
                Translation: [0, float(-0.2, 0.2), 0],
                Using: [
                    render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [
                        1,
                        1,
                        0.3,
                        1,
                    ]),
                ],
            },
        ],
    };
}
