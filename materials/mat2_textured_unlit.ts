import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {TexturedUnlitLayout} from "./layout_textured_unlit.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    in vec3 position;
    in vec2 texcoord;
    out vec2 vert_texcoord;

    void main() {
        vec4 vert_pos = world * vec4(position, 1.0);
        gl_Position = pv * vert_pos;

        vert_texcoord = texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform sampler2D sampler;
    uniform vec4 color;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    void main() {
        frag_color = color * texture(sampler, vert_texcoord);
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
            VertexPosition: gl.getAttribLocation(program, "position")!,
            VertexTexCoord: gl.getAttribLocation(program, "texcoord")!,
        },
    };
}
