import {link, Material} from "../common/material.js";
import {GL_LINE_LOOP} from "../common/webgl.js";
import {BasicLayout} from "./layout_basic.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;

    attribute vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
    }
`;

let fragment = `
    precision mediump float;
    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }
`;

export function mat1_basic_wireframe(gl: WebGLRenderingContext): Material<BasicLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_LINE_LOOP,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Color: gl.getUniformLocation(program, "color")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
        },
    };
}
