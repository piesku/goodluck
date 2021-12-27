import {link, Material} from "../common/material.js";
import {GL_LINE_LOOP, GL_LINE_STRIP, GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, ColoredUnlitLayout} from "./layout.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${Attribute.Position}) in vec4 attr_position;

    void main() {
        gl_Position = pv * world * attr_position;
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

export function mat_forward_colored_unlit(
    gl: WebGL2RenderingContext,
    mode: GLenum = GL_TRIANGLES
): Material<ColoredUnlitLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: mode,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            Color: gl.getUniformLocation(program, "color")!,
        },
    };
}

export function mat_forward_colored_wireframe(gl: WebGL2RenderingContext) {
    return mat_forward_colored_unlit(gl, GL_LINE_LOOP);
}

export function mat_forward_colored_line(gl: WebGL2RenderingContext) {
    return mat_forward_colored_unlit(gl, GL_LINE_STRIP);
}
