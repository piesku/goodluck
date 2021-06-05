import {Action} from "../actions.js";
import {audio_source} from "../components/com_audio_source.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {disable} from "../components/com_disable.js";
import {lifespan} from "../components/com_lifespan.js";
import {render_colored_shaded} from "../components/com_render1.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {shake} from "../components/com_shake.js";
import {task_timeout} from "../components/com_task.js";
import {toggle} from "../components/com_toggle.js";
import {transform} from "../components/com_transform.js";
import {trigger} from "../components/com_trigger.js";
import {Game, Layer} from "../game.js";
import {Blueprint} from "../impl.js";
import {Has} from "../world.js";

export function blueprint_item(game: Game): Blueprint {
    return [
        collide(true, Layer.Collectable, Layer.Terrain | Layer.Player),
        trigger(Layer.Player, Action.CollectItem),
        rigid_body(RigidKind.Dynamic, 0.3),
        audio_source(true),
        lifespan(5),
        disable(Has.Lifespan),
        children([
            transform(),
            render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
            shake(0.05),
            toggle(Has.Shake, 1, true),
            disable(Has.Shake | Has.Toggle),
        ]),
        task_timeout(10, (entity) => {
            game.World.Signature[entity] |= Has.Lifespan;
            let children = game.World.Children[entity];
            let mesh_entity = children.Children[0];
            game.World.Signature[mesh_entity] |= Has.Shake | Has.Toggle;
        }),
    ];
}
