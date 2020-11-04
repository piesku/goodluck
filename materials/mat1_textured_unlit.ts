import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {TexturedUnlitLayout} from "./layout_textured_unlit.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;

    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 vert_texcoord;

    void main() {
        vec4 vert_pos = world * vec4(position, 1.0);
        gl_Position = pv * vert_pos;

        vert_texcoord = texcoord;
    }
`;

let fragment = `
    precision mediump float;

    uniform sampler2D sampler;
    uniform vec4 color;

    varying vec2 vert_texcoord;

    void main() {
        gl_FragColor = color * texture2D(sampler, vert_texcoord);
    }
`;

export function mat1_textured_unlit(gl: WebGLRenderingContext): Material<TexturedUnlitLayout> {
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
