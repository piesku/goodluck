import {Cube} from "../../shapes/Cube.js";
import {collide} from "../components/com_collide.js";
import {lifespan} from "../components/com_lifespan.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_box(game: Game) {
    return <Blueprint>{
        Using: [
            render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            lifespan(7),
        ],
    };
}
