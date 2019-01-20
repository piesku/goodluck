import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, SWARM, RENDER} from "./components.js";

const MASK = TRANSFORM | SWARM;

let view = mat4.create();
mat4.translate(view, view, [0, 0, 50]);
mat4.invert(view, view);

let pv = mat4.create();

export default
function tick(game, delta) {
    let {gl, entities, components} = game;
    mat4.multiply(pv, game.projection, view);

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            draw(gl, components[TRANSFORM][i], components[RENDER][i],
                    components[SWARM][i]);
        }
    }
}

function draw(gl, model, render, swarm) {
    gl.useProgram(render.material.program);
    gl.uniformMatrix4fv(render.material.uniforms.pv, gl.FALSE, pv);
    gl.uniformMatrix4fv(render.material.uniforms.model, gl.FALSE, model);
    gl.uniform4fv(render.material.uniforms.color, render.color);
    gl.uniform1f(render.material.uniforms.timestamp, swarm.age);
    gl.uniform1i(render.material.uniforms.edge, swarm.edge);
    gl.uniform1f(render.material.uniforms.padding, swarm.padding);
    gl.bindVertexArray(render.vao);
    gl.drawElementsInstanced(
        render.material.mode, render.count, gl.UNSIGNED_SHORT, 0,
        swarm.instances);
    gl.bindVertexArray(null);
}
