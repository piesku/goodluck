import {Action} from "../actions.js";
import {audio_source} from "../components/com_audio_source.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_always} from "../components/com_control_always.js";
import {disable} from "../components/com_disable.js";
import {lifespan} from "../components/com_lifespan.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_shaded} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {shake} from "../components/com_shake.js";
import {task_timeout} from "../components/com_task.js";
import {toggle} from "../components/com_toggle.js";
import {transform} from "../components/com_transform.js";
import {trigger} from "../components/com_trigger.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export function blueprint_item(game: Game) {
    return [
        collide(true, Layer.Collectable, Layer.Terrain | Layer.Player),
        trigger(Layer.Player, Action.CollectItem),
        rigid_body(RigidKind.Dynamic, 0.3),
        audio_source(true),
        lifespan(5, Action.ExpireItem),
        disable(Has.Lifespan),
        children([
            transform(undefined, undefined, [0.5, 0.7, 0.1]),
            control_always(null, [0, 1, 0, 0]),
            move(0, 0.2),
            shake(0.05),
            toggle(Has.Shake, 1, true),
            disable(Has.Shake | Has.Toggle),
            children([
                transform([0, 1, 0]),
                render_colored_shaded(game.MaterialColoredShaded, game.MeshCube, [5, 3, 0, 1]),
                children([transform([0, 2, 0]), light_point([1, 0.5, 0], 3)]),
            ]),
        ]),
        task_timeout(10, (entity) => {
            game.World.Signature[entity] |= Has.Lifespan;
            let children = game.World.Children[entity];
            let shaker_entity = children.Children[0];
            game.World.Signature[shaker_entity] |= Has.Shake | Has.Toggle;
        }),
    ];
}
