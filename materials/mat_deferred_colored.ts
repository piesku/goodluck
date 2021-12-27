import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, ColoredShadedLayout, Output} from "./layout.js";

let vertex = `#version 300 es\n

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    layout(location=${Attribute.Position}) in vec4 attr_position;
    layout(location=${Attribute.Normal}) in vec3 attr_normal;

    out vec4 vert_position;
    out vec4 vert_normal;

    void main() {
        vert_position = world * attr_position;
        vert_normal = vec4(attr_normal, 0.0) * self;
        gl_Position = pv * vert_position;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform vec4 diffuse_color;
    uniform vec3 specular_color;
    uniform float shininess;

    in vec4 vert_position;
    in vec4 vert_normal;

    layout(location=${Output.Diffuse}) out vec4 frag_diffuse;
    layout(location=${Output.Specular}) out vec4 frag_specular;
    layout(location=${Output.Position}) out vec4 frag_position;
    layout(location=${Output.Normal}) out vec3 frag_normal;

    void main() {
        frag_diffuse = diffuse_color;
        frag_specular = vec4(specular_color, shininess);
        frag_position = vert_position;
        frag_normal = normalize(vert_normal.xyz);
    }
`;

export function mat_deferred_colored(gl: WebGL2RenderingContext): Material<ColoredShadedLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,

            DiffuseColor: gl.getUniformLocation(program, "diffuse_color")!,
            SpecularColor: gl.getUniformLocation(program, "specular_color")!,
            Shininess: gl.getUniformLocation(program, "shininess")!,
        },
    };
}
