import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface EmitParticles {
    readonly Lifespan: number;
    readonly Frequency: number;
    Instances: Array<number>;
    SinceLast: number;
}

/**
 * Add EmitParticles.
 *
 * @param Lifespan How long particles live for.
 * @param Frequency How often particles spawn.
 */
export function emit_particles(Lifespan: number, Frequency: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.EmitParticles;
        game.World.EmitParticles[entity] = <EmitParticles>{
            Lifespan,
            Frequency,
            Instances: [],
            SinceLast: 0,
        };
    };
}
