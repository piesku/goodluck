import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
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

export function mat_basic_triangles(gl: WebGL2RenderingContext): Material<BasicLayout> {
    let Program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program,
        Locations: {
            Pv: gl.getUniformLocation(Program, "pv")!,
            World: gl.getUniformLocation(Program, "world")!,
            Color: gl.getUniformLocation(Program, "color")!,
            VertexPosition: gl.getAttribLocation(Program, "position")!,
        },
    };
}
