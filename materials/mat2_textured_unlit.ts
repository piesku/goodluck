import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {TexturedUnlitLayout} from "./layout_textured_unlit.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    in vec3 vert_position;
    in vec2 vert_texcoord;
    out vec2 frag_texcoord;

    void main() {
        vec4 vert_pos = world * vec4(vert_position, 1.0);
        gl_Position = pv * vert_pos;

        frag_texcoord = vert_texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform sampler2D sampler;
    uniform vec4 color;

    in vec2 frag_texcoord;
    out vec4 out_color;

    void main() {
        out_color = color * texture(sampler, frag_texcoord);
    }
`;

export function mat2_textured_unlit(gl: WebGL2RenderingContext): Material<TexturedUnlitLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
            Color: gl.getUniformLocation(program, "color")!,
            VertexPosition: gl.getAttribLocation(program, "vert_position")!,
            VertexTexCoord: gl.getAttribLocation(program, "vert_texcoord")!,
        },
    };
}
