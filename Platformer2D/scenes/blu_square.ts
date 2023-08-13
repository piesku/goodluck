import {animate_sprite} from "../components/com_animate_sprite.js";
import {collide2d} from "../components/com_collide2d.js";
import {lifespan} from "../components/com_lifespan.js";
import {local_transform2d} from "../components/com_local_transform2d.js";
import {render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, Layer} from "../game.js";

export const SQUARE_LIFESPAN = 10;

export function blueprint_square(game: Game) {
    return [
        spatial_node2d(),
        local_transform2d(undefined, 0, [1.5, 1.5]),
        collide2d(true, Layer.Object, Layer.Terrain | Layer.Player | Layer.Object, [1.125, 1.125]),
        rigid_body2d(RigidKind.Dynamic, 0.3),
        render2d("13"),
        animate_sprite({13: 0.8, 14: 0.4}),
        lifespan(SQUARE_LIFESPAN),
    ];
}
