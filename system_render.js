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
        if (entities[i] & MASK) {
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

export
function create_render(gl, vertex_array, index_array, material, color) {
    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao);

    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex_array, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(material.attribs.position);
    gl.vertexAttribPointer(material.attribs.position, 3, gl.FLOAT, false,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT);

    let index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index_array, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    return {vao, count: index_array.length, material, color};
}
