import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, PostprocessLayout} from "./layout.js";

let vertex = `#version 300 es\n
    layout(location=${Attribute.Position}) in vec4 attr_position;
    layout(location=${Attribute.TexCoord}) in vec2 attr_texcoord;

    out vec2 vert_texcoord;

    void main() {
        gl_Position = attr_position;
        vert_texcoord = attr_texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform vec2 viewport;
    uniform sampler2D sampler;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    void main() {
        frag_color = texture(sampler, vert_texcoord);
        float luma = dot(frag_color.rgb, vec3(0.2126, 0.7152, 0.0722));
        if (luma < 1.0) {
            frag_color *= luma;
        }
    }
`;

export function mat_postprocess_brightness(
    gl: WebGL2RenderingContext
): Material<PostprocessLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Viewport: gl.getUniformLocation(program, "viewport")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
        },
    };
}
