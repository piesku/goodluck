import {animate_sprite} from "../components/com_animate_sprite.js";
import {collide2d} from "../components/com_collide2d.js";
import {control_player} from "../components/com_control_player.js";
import {disable} from "../components/com_disable.js";
import {local_transform2d} from "../components/com_local_transform2d.js";
import {render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export function blueprint_player(game: Game) {
    return [
        spatial_node2d(),
        local_transform2d(undefined, 0, [1.5, 1.5]),
        collide2d(true, Layer.Object, Layer.Terrain | Layer.Object, [1.5, 1.5]),
        rigid_body2d(RigidKind.Dynamic, 0.3),
        control_player(),
        render2d("6"),
        animate_sprite({6: 0.4, 7: 0.4}),
        disable(Has.AnimateSprite),
    ];
}
