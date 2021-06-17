import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {TexturedUnlitLayout} from "./layout.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;

    attribute vec3 attr_position;
    attribute vec2 attr_texcoord;

    varying vec2 vert_texcoord;

    void main() {
        vec4 attr_pos = world * vec4(attr_position, 1.0);
        gl_Position = pv * attr_pos;

        vert_texcoord = attr_texcoord;
    }
`;

let fragment = `
    precision mediump float;

    uniform sampler2D texture_map;
    uniform vec4 color;

    varying vec2 vert_texcoord;

    void main() {
        gl_FragColor = color * texture2D(texture_map, vert_texcoord);
    }
`;

export function mat1_forward_textured_unlit(
    gl: WebGLRenderingContext
): Material<TexturedUnlitLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            TextureMap: gl.getUniformLocation(program, "texture_map")!,
            Color: gl.getUniformLocation(program, "color")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexCoord: gl.getAttribLocation(program, "attr_texcoord")!,
        },
    };
}
