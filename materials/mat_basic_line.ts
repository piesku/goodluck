import {link, Material} from "../common/material.js";
import {GL_LINE_STRIP} from "../common/webgl.js";
import {BasicLayout} from "./layout_basic.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
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

export function mat_basic_line(gl: WebGL2RenderingContext): Material<BasicLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_LINE_STRIP,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Color: gl.getUniformLocation(program, "color")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
        },
    };
}
