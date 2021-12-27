import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, WorldSpaceLayout} from "./layout.js";

let vertex = `#version 300 es\n

    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${Attribute.Position}) in vec4 attr_position;

    void main() {
        gl_Position = pv * world * attr_position;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    out vec4 frag_color;

    void main() {
        // Visualization only. Actual z is saved in the depth buffer.
        float z = gl_FragCoord.z * 10.0;
        frag_color = vec4(z, z, z, 1.0);
    }
`;

export function mat_forward_depth(gl: WebGL2RenderingContext): Material<WorldSpaceLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
        },
    };
}
