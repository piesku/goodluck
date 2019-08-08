import {BasicAttribute} from "../components/com_render_basic.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;

    layout(location=${BasicAttribute.position}) in vec3 position;
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

export function mat_wireframe(gl: WebGL2RenderingContext) {
    return mat_create(gl, gl.LINE_LOOP, vertex, fragment);
}
