import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.EmitParticles;

export function sys_particles(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

let origin: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let emitter = game.World.EmitParticles[entity];
    let transform = game.World.Transform[entity];

    emitter.SinceLast += delta;
    if (emitter.SinceLast > emitter.Frequency) {
        emitter.SinceLast = 0;
        get_translation(origin, transform.World);
        // Push [x, y, z, age].
        emitter.Instances.push(...origin, 0);
    }

    // A flat continuous array of particle data, from which a Float32Array
    // is created in sys_render and sent as a vertex attribute array.
    for (let i = 0; i < emitter.Instances.length; ) {
        emitter.Instances[i + 3] += delta / emitter.Lifespan;
        if (emitter.Instances[i + 3] > 1) {
            emitter.Instances.splice(i, 4);
        } else {
            i += 4;
        }
    }
}
