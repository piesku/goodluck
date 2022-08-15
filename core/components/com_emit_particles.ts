/**
 * # EmitParticles
 *
 * The `EmitParticles` component makes the entity emit particles.
 *
 * The particles are data points stored in an array, updated by
 * [`sys_particles`](sys_particles.html). If the entity has one of the
 * [`RenderParticles`](com_render.html) components (colored or textured), the
 * particles are rendered by [`sys_render_forward`](sys_render_forward.html).
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface EmitParticles {
    Lifespan: number;
    Frequency: number;
    Speed: number;
    Instances: Array<number>;
    SinceLast: number;
}

/**
 * Add `EmitParticles` to an entity.
 *
 * The entity also needs the [`RenderParticlesColored`](com_render.html) or
 * [`RenderParticlesTextured`](com_render.html) component.
 *
 * @param lifespan How long particles live for.
 * @param frequency How often particles spawn.
 * @param speed How fast particles move.
 */
export function emit_particles(lifespan: number, frequency: number, speed: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.EmitParticles;
        game.World.EmitParticles[entity] = {
            Lifespan: lifespan,
            Frequency: frequency,
            Speed: speed,
            Instances: [],
            SinceLast: 0,
        };
    };
}
