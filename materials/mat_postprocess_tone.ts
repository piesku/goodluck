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
    uniform sampler2D bloom_map;

    in vec2 vert_texcoord;
    out vec4 frag_color;

    vec3 map_tone_rainhard(vec3 color) {
        return color / (color + vec3(1.0));
    }

    // https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
    vec3 map_tone_aces(vec3 color) {
        const float a = 2.51;
        const float b = 0.03;
        const float c = 2.43;
        const float d = 0.59;
        const float e = 0.14;
        return clamp(
            (color * (a * color + b)) / (color * (c * color + d) + e),
            0.0, 1.0);
    }

    void main() {
        vec3 hdr_rgb = texture(sampler, vert_texcoord).xyz;
        vec3 bloom_rgb = texture(bloom_map, vert_texcoord).xyz;
        frag_color = vec4(map_tone_aces(hdr_rgb + bloom_rgb), 1.0);
    }
`;

export function mat_postprocess_tone(
    gl: WebGL2RenderingContext
): Material<PostprocessLayout & {Bloom: WebGLUniformLocation}> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Viewport: gl.getUniformLocation(program, "viewport")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
            Bloom: gl.getUniformLocation(program, "bloom_map")!,
        },
    };
}
