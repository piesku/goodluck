import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {TexturedAttribute} from "../components/com_render_textured.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    layout(location=${TexturedAttribute.Position}) in vec3 position;
    layout(location=${TexturedAttribute.TextureCoord}) in vec2 texcoord;

    out vec2 vert_texcoord;

    void main() {
        vec4 vert_pos = world * vec4(position, 1.0);
        gl_Position = pv * vert_pos;

        vert_texcoord = texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    uniform sampler2D sampler;

    void main() {
        frag_color = texture(sampler, vert_texcoord);
    }
`;

export function mat_textured(gl: WebGL2RenderingContext): Material {
    let Program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "self")!,
            gl.getUniformLocation(Program, "sampler")!,
        ],
    };
}
