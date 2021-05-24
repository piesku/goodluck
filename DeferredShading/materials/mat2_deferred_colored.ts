import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {DeferredColoredLayout} from "./layout_deferred_colored.js";

let vertex = `#version 300 es\n

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    in vec3 vert_position;
    in vec3 vert_normal;

    out vec4 frag_position;
    out vec4 frag_normal;

    void main() {
        frag_position = world * vec4(vert_position, 1.0);
        frag_normal = vec4(vert_normal, 1.0) * self;
        gl_Position = pv * frag_position;
    }
`;

let fragment = `#version 300 es\n

    precision mediump float;

    uniform vec4 color_diffuse;
    uniform vec3 color_specular;
    uniform float shininess;

    in vec4 frag_position;
    in vec4 frag_normal;

    layout(location = 0) out vec4 out_diffuse;
    layout(location = 1) out vec4 out_specular;
    layout(location = 2) out vec4 out_position;
    layout(location = 3) out vec3 out_normal;

    void main() {
        out_diffuse = color_diffuse;
        out_specular = vec4(color_specular, shininess);
        out_position = frag_position;
        out_normal = normalize(frag_normal.xyz);
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
            ColorDiffuse: gl.getUniformLocation(program, "color_diffuse")!,
            ColorSpecular: gl.getUniformLocation(program, "color_specular")!,
            Shininess: gl.getUniformLocation(program, "shininess")!,
            VertexPosition: gl.getAttribLocation(program, "vert_position")!,
            VertexNormal: gl.getAttribLocation(program, "vert_normal")!,
        },
    };
}
