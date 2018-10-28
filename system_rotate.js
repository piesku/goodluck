import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_TRANSFORM} from "./components.js";

export default
function tick({entities, components}, delta) {
    for (let i = 0; i < entities.length; i++) {
        if (entities[i] & COMPONENT_TRANSFORM) {
            let model = components.transform[i];
            update(model, delta);
        }
    }
}

function update(model, delta) {
    mat4.rotateX(model, model, 0.1 * delta);
    mat4.rotateY(model, model, 0.2 * delta);
    mat4.rotateZ(model, model, 0.3 * delta);
}
