import {link, Material} from "../../common/material.js";
import {GL_POINTS} from "../../common/webgl.js";
import {ParticlesLayout} from "./layout_particles.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    // [red, green, blue, size]
    uniform vec4 color_size_start;
    uniform vec4 color_size_end;

    // [x, y, z, age]
    in vec4 origin_age;

    out vec4 vert_color;

    void main() {
        vec4 origin = vec4(origin_age.xyz, 1.0);
        float age = origin_age.w;
        origin.y += age * 10.0;
        gl_PointSize = mix(color_size_start.w, color_size_end.w, age);
        gl_Position = pv * origin;
        vert_color = mix(vec4(color_size_start.rgb, 1.0), vec4(color_size_end.rgb, 1.0), age);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main(){
        frag_color = vert_color;
    }
`;

export function mat_particles(gl: WebGL2RenderingContext): Material<ParticlesLayout> {
    let Program = link(gl, vertex, fragment);
    return {
        Mode: GL_POINTS,
        Program,
        Locations: {
            Pv: gl.getUniformLocation(Program, "pv")!,
            ColorSizeStart: gl.getUniformLocation(Program, "color_size_start")!,
            ColorSizeEnd: gl.getUniformLocation(Program, "color_size_end")!,
            OriginAge: gl.getAttribLocation(Program, "origin_age")!,
        },
    };
}
