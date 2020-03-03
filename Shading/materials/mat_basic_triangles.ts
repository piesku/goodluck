import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {BasicAttribute} from "../components/com_render_basic.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${BasicAttribute.Position}) in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
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

export function mat_basic_triangles(gl: WebGL2RenderingContext) {
    let Program = link(gl, vertex, fragment);
    return <Material>{
        Mode: GL_TRIANGLES,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "color")!,
        ],
    };
}
