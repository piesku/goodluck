import {GL_POINTS} from "../../common/webgl.js";
import {BasicAttribute} from "../components/com_render_basic.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${BasicAttribute.Position}) in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
        gl_PointSize = 2.0;
    }
`;

let fragment = `#version 300 es
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export function mat_points(gl: WebGL2RenderingContext) {
    let material = <Material>{
        Mode: GL_POINTS,
        Program: link(gl, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["pv", "world", "color"]) {
        material.Uniforms.push(gl.getUniformLocation(material.Program, name)!);
    }

    return material;
}
