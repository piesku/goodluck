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

    // https://www.rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
    const float offset[3] = float[](0.0, 1.3846153846, 3.2307692308);
    const float weight[3] = float[](0.2270270270, 0.3162162162, 0.0702702703);

    void main() {
        vec2 unit = 1.0 / viewport;
        vec3 result = texture(sampler, vert_texcoord).rgb * weight[0];

        if (horizontal) {
            for (int i = 1; i < 3; i++) {
                result += texture(sampler, vert_texcoord + vec2(unit.x * offset[i], 0.0)).rgb * weight[i];
                result += texture(sampler, vert_texcoord - vec2(unit.x * offset[i], 0.0)).rgb * weight[i];
            }
        } else {
            for (int i = 1; i < 3; i++) {
                result += texture(sampler, vert_texcoord + vec2(0.0, unit.y * offset[i])).rgb * weight[i];
                result += texture(sampler, vert_texcoord - vec2(0.0, unit.y * offset[i])).rgb * weight[i];
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
