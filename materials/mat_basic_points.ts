import {link, Material} from "../common/material.js";
import {GL_POINTS} from "../common/webgl.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
        gl_PointSize = 2.0;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export function mat_basic_points(gl: WebGL2RenderingContext): Material {
    let Program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "color")!,
        ],
        Attributes: [gl.getAttribLocation(Program, "position")!],
    };
}
