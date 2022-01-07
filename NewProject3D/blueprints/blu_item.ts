import {from_euler} from "../../common/quat.js";
import {Entity} from "../../common/world.js";
import {Action} from "../actions.js";
import {audio_source} from "../components/com_audio_source.js";
import {callback} from "../components/com_callback.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_always} from "../components/com_control_always.js";
import {disable} from "../components/com_disable.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {lifespan} from "../components/com_lifespan.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {
    RenderParticlesColored,
    render_colored_shaded,
    render_particles_colored,
} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {shake} from "../components/com_shake.js";
import {task_timeout} from "../components/com_task.js";
import {toggle} from "../components/com_toggle.js";
import {transform} from "../components/com_transform.js";
import {trigger} from "../components/com_trigger.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export function blueprint_item(game: Game) {
    let shaker_entity: Entity;
    let particles_entity: Entity;
    return [
        collide(true, Layer.Collectable, Layer.Terrain | Layer.Player),
        trigger(Layer.Player, Action.CollectItem),
        rigid_body(RigidKind.Dynamic, 0.3),
        audio_source(true),
        lifespan(5, Action.ExpireItem),
        disable(Has.Lifespan),
        children(
            [
                callback((game, entity) => (shaker_entity = entity)),
                transform(undefined, undefined, [0.5, 0.7, 0.1]),
                control_always(null, [0, 1, 0, 0]),
                move(0, 0.2),
                shake(0.05),
                toggle(Has.Shake, 1, true),
                disable(Has.Shake | Has.Toggle),
                children([
                    transform([0, 1, 0]),
                    render_colored_shaded(game.MaterialColoredShaded, game.MeshCube, [5, 3, 0, 1]),
                    children([transform([0, 1, 0]), light_point([1, 0.5, 0], 3)]),
                ]),
            ],
            [
                transform([0, 1.5, 0]),
                control_always(null, [0, 1, 0, 0]),
                move(0, 2),
                children([
                    transform([0, 0, 0.2], from_euler([0, 0, 0, 1], -90, 0, 0)),
                    children([
                        callback((game, entity) => (particles_entity = entity)),
                        transform(),
                        shake(0.05),
                        emit_particles(2, 0.2, 1),
                        render_particles_colored(
                            game.MaterialParticlesColored,
                            [1, 1, 1, 1],
                            5,
                            [1, 1, 1, 0],
                            1
                        ),
                    ]),
                ]),
            ]
        ),
        task_timeout(10, (entity) => {
            // Start the lifetime countdown.
            game.World.Signature[entity] |= Has.Lifespan;

            // Start shaking the mesh.
            game.World.Signature[shaker_entity] |= Has.Shake | Has.Toggle;

            // Change particles to a flame.
            let particles_shake = game.World.Shake[particles_entity];
            particles_shake.Magnitude = 0.1;
            let particles_emit = game.World.EmitParticles[particles_entity];
            particles_emit.Lifespan = 1;
            particles_emit.Frequency = 0.1;
            let particles_render = game.World.Render[particles_entity] as RenderParticlesColored;
            particles_render.ColorStart = [1, 1, 0, 1];
            particles_render.ColorEnd = [1, 0, 0, 0];
            particles_render.Size = [10, 5];
        }),
    ];
}
