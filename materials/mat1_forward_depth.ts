import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {DepthMappingLayout} from "./layout.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;

    attribute vec3 attr_position;

    void main() {
        gl_Position = pv * world * vec4(attr_position, 1.0);
    }
`;

let fragment = `
    precision mediump float;

    void main() {
        // Visualization only. Actual z is saved in the depth buffer.
        float z = gl_FragCoord.z * 10.0;
        gl_FragColor = vec4(z, z, z, 1.0);
    }
`;

export function mat1_forward_depth(gl: WebGLRenderingContext): Material<DepthMappingLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
        },
    };
}
