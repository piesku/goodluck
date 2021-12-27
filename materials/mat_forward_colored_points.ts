import {link, Material} from "../common/material.js";
import {GL_POINTS} from "../common/webgl.js";
import {Attribute, ColoredUnlitLayout} from "./layout.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${Attribute.Position}) in vec4 attr_position;

    void main() {
        gl_Position = pv * world * attr_position;
        gl_PointSize = 8.0;
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

export function mat_forward_colored_points(
    gl: WebGL2RenderingContext
): Material<ColoredUnlitLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            Color: gl.getUniformLocation(program, "color")!,
        },
    };
}
