import {link, Material} from "../../common/material.js";
import {GL_POINTS} from "../../common/webgl.js";
import {ParticlesTexturedLayout} from "./layout_particles_textured.js";

let vertex = `
    uniform mat4 pv;
    uniform vec4 color_start;
    uniform vec4 color_end;
    // [x: lifespan, y: speed, z: size_start, w: size_end];
    uniform vec4 details;

    // [x, y, z, w: age]
    attribute vec4 vert_origin_age;
    // [x, y, z, w: seed]
    attribute vec4 vert_direction_seed;

    varying vec4 frag_color;
    varying float frag_rand;

    void main() {
        // Move the particle along the direction axis.
        vec3 velocity = vert_direction_seed.xyz * details.y;
        gl_Position = pv * vec4(vert_origin_age.xyz + velocity * vert_origin_age.w, 1.0);

        // Interpolate color and size.
        float t = vert_origin_age.w / details.x;
        gl_PointSize = mix(details.z, details.w, t);
        frag_color = mix(color_start, color_end, t);

        // Random seed to pick the sprite.
        frag_rand = 3.14 * t + vert_direction_seed.w;
    }
`;

let fragment = `
    precision mediump float;

    uniform sampler2D sampler;

    varying vec4 frag_color;
    varying float frag_rand;

    void main() {
        // Add -1, 0, or 1 to each component of the point coord vector.
        vec2 uv = gl_PointCoord + floor(vec2(cos(frag_rand) + 0.5, sin(frag_rand) + 0.5));
        gl_FragColor = frag_color * texture2D(sampler, uv / 2.0);
    }
`;

export function mat1_particles_textured(
    gl: WebGLRenderingContext
): Material<ParticlesTexturedLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
            ColorStart: gl.getUniformLocation(program, "color_start")!,
            ColorEnd: gl.getUniformLocation(program, "color_end")!,
            Details: gl.getUniformLocation(program, "details")!,
            OriginAge: gl.getAttribLocation(program, "vert_origin_age")!,
            DirectionSeed: gl.getAttribLocation(program, "vert_direction_seed")!,
        },
    };
}
