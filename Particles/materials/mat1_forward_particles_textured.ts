import {link, Material} from "../../common/material.js";
import {GL_POINTS} from "../../common/webgl.js";
import {ParticlesTexturedLayout} from "./layout_particles.js";

let vertex = `
    uniform mat4 pv;
    uniform vec4 color_start;
    uniform vec4 color_end;
    // [x: lifespan, y: speed, z: size_start, w: size_end];
    uniform vec4 details;

    // [x, y, z, w: age]
    attribute vec4 attr_origin_age;
    // [x, y, z, w: seed]
    attribute vec4 attr_direction_seed;

    varying vec4 vert_color;
    varying float vert_rand;

    void main() {
        // Move the particle along the direction axis.
        vec3 velocity = attr_direction_seed.xyz * details.y;
        gl_Position = pv * vec4(attr_origin_age.xyz + velocity * attr_origin_age.w, 1.0);

        // Interpolate color and size.
        float t = attr_origin_age.w / details.x;
        gl_PointSize = mix(details.z, details.w, t);
        vert_color = mix(color_start, color_end, t);

        // Random seed to pick the sprite.
        vert_rand = 3.14 * t + attr_direction_seed.w;
    }
`;

let fragment = `
    precision mediump float;

    uniform sampler2D texture_map;

    varying vec4 vert_color;
    varying float vert_rand;

    void main() {
        // Add -1, 0, or 1 to each component of the point coord vector.
        vec2 uv = gl_PointCoord + floor(vec2(cos(vert_rand) + 0.5, sin(vert_rand) + 0.5));
        gl_FragColor = vert_color * texture2D(texture_map, uv / 2.0);
    }
`;

export function mat1_forward_particles_textured(
    gl: WebGLRenderingContext
): Material<ParticlesTexturedLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,

            TextureMap: gl.getUniformLocation(program, "texture_map")!,
            ColorStart: gl.getUniformLocation(program, "color_start")!,
            ColorEnd: gl.getUniformLocation(program, "color_end")!,
            Details: gl.getUniformLocation(program, "details")!,

            OriginAge: gl.getAttribLocation(program, "attr_origin_age")!,
            DirectionSeed: gl.getAttribLocation(program, "attr_direction_seed")!,
        },
    };
}
