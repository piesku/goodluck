import {link, Material} from "../../common/material.js";
import {GL_POINTS} from "../../common/webgl.js";
import {ParticlesLayout} from "./layout_particles.js";

let vertex = `
    uniform mat4 pv;
    // [red, green, blue, size]
    uniform vec4 color_size_start;
    uniform vec4 color_size_end;

    // [x, y, z, age]
    attribute vec4 origin_age;
    varying vec4 vert_color;

    void main() {
        vec4 origin = vec4(origin_age.xyz, 1.0);
        float age = origin_age.w;
        origin.y += age * 10.0;
        gl_PointSize = mix(color_size_start.w, color_size_end.w, age);
        gl_Position = pv * origin;
        vert_color = mix(vec4(color_size_start.rgb, 1.0), vec4(color_size_end.rgb, 1.0), age);
    }
`;

let fragment = `
    precision mediump float;

    varying vec4 vert_color;

    void main(){
        gl_FragColor = vert_color;
    }
`;

export function mat1_particles(gl: WebGLRenderingContext): Material<ParticlesLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            ColorSizeStart: gl.getUniformLocation(program, "color_size_start")!,
            ColorSizeEnd: gl.getUniformLocation(program, "color_size_end")!,
            OriginAge: gl.getAttribLocation(program, "origin_age")!,
        },
    };
}
