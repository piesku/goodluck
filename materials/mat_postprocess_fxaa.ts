import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, PostprocessLayout} from "./layout.js";
import {INCLUDE_GAMMA_CORRECTION} from "./light.js";

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

    #define FXAA_REDUCE_MIN   (1.0 / 128.0)
    #define FXAA_REDUCE_MUL   (1.0 / 8.0)
    #define FXAA_SPAN_MAX     8.0

    // https://github.com/mitsuhiko/webgl-meincraft/blob/master/assets/shaders/fxaa.glsl
    // https://github.com/mattdesl/glsl-fxaa/blob/master/fxaa.glsl
    vec3 fxaa(sampler2D tex, vec2 frag_coord) {
        vec4 color;
        vec2 inverseVP = vec2(1.0 / viewport.x, 1.0 / viewport.y);
        vec3 rgbNW = texture(tex, (frag_coord + vec2(-1.0, -1.0)) * inverseVP).xyz;
        vec3 rgbNE = texture(tex, (frag_coord + vec2(1.0, -1.0)) * inverseVP).xyz;
        vec3 rgbSW = texture(tex, (frag_coord + vec2(-1.0, 1.0)) * inverseVP).xyz;
        vec3 rgbSE = texture(tex, (frag_coord + vec2(1.0, 1.0)) * inverseVP).xyz;
        vec3 rgbM  = texture(tex, frag_coord  * inverseVP).xyz;

        vec3 luma = vec3(0.299, 0.587, 0.114);
        float lumaNW = dot(rgbNW, luma);
        float lumaNE = dot(rgbNE, luma);
        float lumaSW = dot(rgbSW, luma);
        float lumaSE = dot(rgbSE, luma);
        float lumaM  = dot(rgbM,  luma);
        float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
        float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

        vec2 dir;
        dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
        dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

        float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                            (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

        float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
        dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
                max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                dir * rcpDirMin)) * inverseVP;

        vec3 rgbA = 0.5 * (
            texture(tex, frag_coord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
            texture(tex, frag_coord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
        vec3 rgbB = rgbA * 0.5 + 0.25 * (
            texture(tex, frag_coord * inverseVP + dir * -0.5).xyz +
            texture(tex, frag_coord * inverseVP + dir * 0.5).xyz);

        float lumaB = dot(rgbB, luma);
        if ((lumaB < lumaMin) || (lumaB > lumaMax)) {
            return rgbA;
        }

        return rgbB;
    }

    ${INCLUDE_GAMMA_CORRECTION}

    void main() {
        frag_color = vec4(GAMMA_ENCODE(fxaa(sampler, gl_FragCoord.xy)), 1.0);
    }
`;

export function mat_postprocess_fxaa(gl: WebGL2RenderingContext): Material<PostprocessLayout> {
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
