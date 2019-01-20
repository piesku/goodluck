import * as mat4 from "./gl-matrix/mat4.js";
import {SWARM} from "./components.js";

const MASK = SWARM;

export default
function tick({entities, components}, delta) {
    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            update(delta, components[SWARM][i]);
        }
    }
}

function update(delta, swarm) {
    swarm.age += delta;
}
