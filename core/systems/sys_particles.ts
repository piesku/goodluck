import {get_forward, get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_PARTICLE} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.EmitParticles;

export function sys_particles(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

let origin: Vec3 = [0, 0, 0];
let forward: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let emitter = game.World.EmitParticles[entity];
    let transform = game.World.Transform[entity];

    emitter.SinceLast += delta;
    if (emitter.SinceLast > emitter.Frequency) {
        emitter.SinceLast = 0;
        get_translation(origin, transform.World);
        get_forward(forward, transform.World);
        // Push [x, y, z, age].
        emitter.Instances.push(...origin, 0);
        // Push [x, y, z, seed].
        emitter.Instances.push(...forward, Math.random());
    }

    // A flat continuous array of particle data, from which a Float32Array
    // is created in sys_render and sent as a vertex attribute array.
    for (let i = 0; i < emitter.Instances.length; ) {
        emitter.Instances[i + 3] += delta;
        if (emitter.Instances[i + 3] > emitter.Lifespan) {
            emitter.Instances.splice(i, FLOATS_PER_PARTICLE);
        } else {
            i += FLOATS_PER_PARTICLE;
        }
    }
}
