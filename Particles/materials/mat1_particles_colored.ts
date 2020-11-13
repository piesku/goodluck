import {link, Material} from "../../common/material.js";
import {GL_POINTS} from "../../common/webgl.js";
import {ParticlesColoredLayout} from "./layout_particles_colored.js";

let vertex = `
    uniform mat4 pv;
    uniform vec4 color_start;
    uniform vec4 color_end;
    // [x: lifespan, y: speed, z: size_start, w: size_end];
    uniform vec4 details;

    // [x, y, z, w: age]
    attribute vec4 origin_age;
    attribute vec3 direction;

    varying vec4 vert_color;

    void main() {
        // Move the particle along the direction axis.
        vec3 velocity = direction * details.y;
        gl_Position = pv * vec4(origin_age.xyz + velocity * origin_age.w, 1.0);

        // Interpolate color and size.
        float t = origin_age.w / details.x;
        gl_PointSize = mix(details.z, details.w, t);
        vert_color = mix(color_start, color_end, t);
    }
`;

let fragment = `
    precision mediump float;

    varying vec4 vert_color;

    void main() {
        gl_FragColor = vert_color;
    }
`;

export function mat1_particles_colored(
    gl: WebGLRenderingContext
): Material<ParticlesColoredLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            ColorStart: gl.getUniformLocation(program, "color_start")!,
            ColorEnd: gl.getUniformLocation(program, "color_end")!,
            Details: gl.getUniformLocation(program, "details")!,
            OriginAge: gl.getAttribLocation(program, "origin_age")!,
            Direction: gl.getAttribLocation(program, "direction")!,
        },
    };
}
