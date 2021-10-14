import {link, Material} from "../../common/material.js";
import {GL_TRIANGLE_STRIP} from "../../common/webgl.js";
import {Instanced2DLayout} from "./layout_instanced2d.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;

    // Vertex attributes
    in vec4 attr_position;
    in vec2 attr_texcoord;

    // Instance attributes
    in vec4 attr_column1;
    in vec4 attr_column2;
    in vec4 attr_column3;
    in vec4 attr_column4;
    in vec4 attr_color;

    out vec4 vert_color;
    out vec2 vert_texcoord;

    void main() {
        mat4 world = mat4(
            attr_column1,
            attr_column2,
            attr_column3,
            attr_column4
        );

        vec4 world_position = world * attr_position;
        gl_Position = pv * world_position;

        vert_color = attr_color;
        vert_texcoord = attr_texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;
    in vec2 vert_texcoord;

    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_instanced2d(gl: WebGL2RenderingContext): Material<Instanced2DLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLE_STRIP,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexcoord: gl.getAttribLocation(program, "attr_texcoord")!,

            InstanceColumn1: gl.getAttribLocation(program, "attr_column1")!,
            InstanceColumn2: gl.getAttribLocation(program, "attr_column2")!,
            InstanceColumn3: gl.getAttribLocation(program, "attr_column3")!,
            InstanceColumn4: gl.getAttribLocation(program, "attr_column4")!,
            InstanceColor: gl.getAttribLocation(program, "attr_color")!,
        },
    };
}
