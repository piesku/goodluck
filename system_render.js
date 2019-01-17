import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_RENDER, COMPONENT_TRANSFORM} from "./components.js";

const MASK = COMPONENT_RENDER | COMPONENT_TRANSFORM;

let view = mat4.create();
mat4.translate(view, view, [0, 0, 10]);
mat4.invert(view, view);

let pv = mat4.create();

export default
function tick(game, delta) {
    let {gl, entities, components} = game;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.multiply(pv, game.projection, view);

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            // TODO Sort by material.
            draw(gl, components.transform[i], components.render[i]);
        }
    }
}

function draw(gl, model, {vao, count, material, color}) {
    gl.useProgram(material.program);
    gl.uniformMatrix4fv(material.uniforms.pv, gl.FALSE, pv);
    gl.uniformMatrix4fv(material.uniforms.model, gl.FALSE, model);
    gl.uniform4fv(material.uniforms.color, color);
    gl.bindVertexArray(vao);
    gl.drawElements(material.mode, count, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}
