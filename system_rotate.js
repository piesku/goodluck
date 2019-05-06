import {multiply} from "./gl-matrix/quat.js";
import {TRANSFORM, ROTATE} from "./components.js";

const MASK = TRANSFORM | ROTATE;

export default
function tick({entities, components}, delta) {
    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            update(delta, components[TRANSFORM][i], components[ROTATE][i]);
        }
    }
}

function update(delta, transform, rotation) {
    transform.rotation = multiply(
        transform.rotation, rotation, transform.rotation);
}
