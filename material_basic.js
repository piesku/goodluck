import {compile, link, reflect} from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;

    in vec3 position;
    in vec4 color;

    out vec4 vert_color;

    void main() {
        gl_Position = pv * model * vec4(position, 1.0);
        vert_color = color;
    }
`;

let fragment = `#version 300 es
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export default
function create(gl) {
    let program = link(gl,
            compile(gl, gl.VERTEX_SHADER, vertex),
            compile(gl, gl.FRAGMENT_SHADER, fragment));

    let {attribs, uniforms} = reflect(gl, program);

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao);

    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    gl.enableVertexAttribArray(attribs.position);
    gl.vertexAttribPointer(attribs.position, 3, gl.FLOAT, false,
            7 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(attribs.color);
    gl.vertexAttribPointer(attribs.color, 4, gl.FLOAT, false,
            7 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT);

    gl.bindVertexArray(null);

    return {program, attribs, uniforms, vao};
}
