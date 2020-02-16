import {float} from "../../common/random.js";
import {Cube} from "../../shapes/Cube.js";
import {collide} from "../components/com_collide.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_ground(game: Game, size: number) {
    return <Blueprint>{
        Scale: [size, 1, size],
        Using: [collide(false), rigid_body(false)],
        Children: [
            {
                Translation: [0, float(-0.2, 0.2), 0],
                Using: [render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1])],
            },
        ],
    };
}
