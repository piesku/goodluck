import * as mat4 from "./gl-matrix/mat4.js";
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

function update(delta, model, [x, y, z]) {
    mat4.rotateX(model, model, x * delta);
    mat4.rotateY(model, model, y * delta);
    mat4.rotateZ(model, model, z * delta);
}
