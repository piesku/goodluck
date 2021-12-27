import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, TexturedUnlitLayout} from "./layout.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${Attribute.Position}) in vec4 attr_position;
    layout(location=${Attribute.TexCoord}) in vec2 attr_texcoord;

    out vec2 vert_texcoord;

    void main() {
        vec4 attr_pos = world * attr_position;
        gl_Position = pv * attr_pos;

        vert_texcoord = attr_texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform sampler2D texture_map;
    uniform vec4 color;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    void main() {
        frag_color = color * texture(texture_map, vert_texcoord);
    }
`;

export function mat_forward_textured_unlit(
    gl: WebGL2RenderingContext
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
        },
    };
}
