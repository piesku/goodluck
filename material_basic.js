import create from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;

    in vec3 position;
    in vec3 normal;
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
function create_basic(gl) {
    return create(gl, vertex, fragment, gl.TRIANGLES);
}
