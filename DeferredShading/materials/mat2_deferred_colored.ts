import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {DeferredColoredLayout} from "./layout_deferred_colored.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    in vec3 position;
    in vec3 normal;

    out vec4 vert_position;
    out vec3 vert_normal;

    void main() {
        vert_position = world * vec4(position, 1.0);
        gl_Position = pv * vert_position;
        vert_normal = normalize((vec4(normal, 1.0) * self).xyz);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform vec4 color;

    in vec4 vert_position;
    in vec3 vert_normal;

    layout(location = 0) out vec4 frag_color;
    layout(location = 1) out vec4 frag_position;
    layout(location = 2) out vec3 frag_normal;

    void main() {
        frag_color = color;
        frag_position = vert_position;
        frag_normal = vert_normal;
    }
`;

export function mat2_deferred_colored(gl: WebGLRenderingContext): Material<DeferredColoredLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,
            Color: gl.getUniformLocation(program, "color")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
            VertexNormal: gl.getAttribLocation(program, "normal")!,
        },
    };
}
