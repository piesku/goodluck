import {compile, link, reflect} from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;

    in vec3 position;

    void main() {
        gl_Position = pv * model * vec4(position, 1.0);
        gl_PointSize = 3.0;
    }
`;

let fragment = `#version 300 es
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export default
function create(gl) {
    let program = link(gl,
            compile(gl, gl.VERTEX_SHADER, vertex),
            compile(gl, gl.FRAGMENT_SHADER, fragment));
    return {mode: gl.POINTS, program, ...reflect(gl, program)};
}
