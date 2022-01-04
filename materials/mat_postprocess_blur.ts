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
    uniform bool horizontal;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    const float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

    void main() {
        vec2 offset = 1.0 / viewport;
        vec3 result = texture(sampler, vert_texcoord).rgb * weight[0];

        if (horizontal) {
            for (int i = 1; i < 5; i++) {
                result += texture(sampler, vert_texcoord + vec2(offset.x * float(i), 0.0)).rgb * weight[i];
                result += texture(sampler, vert_texcoord - vec2(offset.x * float(i), 0.0)).rgb * weight[i];
            }
        }
        else {
            for (int i = 1; i < 5; i++) {
                result += texture(sampler, vert_texcoord + vec2(0.0, offset.y * float(i))).rgb * weight[i];
                result += texture(sampler, vert_texcoord - vec2(0.0, offset.y * float(i))).rgb * weight[i];
            }
        }

        frag_color = vec4(result, 1.0);
    }
`;

export function mat_postprocess_blur(
    gl: WebGL2RenderingContext
): Material<PostprocessLayout & {Horizontal: WebGLUniformLocation}> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Viewport: gl.getUniformLocation(program, "viewport")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
            Horizontal: gl.getUniformLocation(program, "horizontal")!,
        },
    };
}
