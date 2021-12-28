import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {Attribute, WorldSpaceLayout} from "../../materials/layout.js";
import {FogLayout, InstancedColorLayout, InstancedColumnLayout} from "./layout_instancing.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform vec3 eye;
    uniform vec4 fog_color;
    uniform float fog_distance;

    layout(location=${Attribute.Position}) in vec4 attr_position;
    in vec4 attr_column1;
    in vec4 attr_column2;
    in vec4 attr_column3;
    in vec4 attr_column4;
    in vec3 attr_color;

    out vec4 vert_color;

    void main() {
        mat4 instance = mat4(
            attr_column1,
            attr_column2,
            attr_column3,
            attr_column4
        );

        vec4 vert_position = world * instance * attr_position;
        gl_Position = pv * vert_position;

        vert_color = vec4(attr_color, 1.0);

        float eye_distance = length(eye - vert_position.xyz);
        float fog_amount = clamp(0.0, 1.0, eye_distance / fog_distance);
        vert_color = mix(vert_color, fog_color, smoothstep(0.0, 1.0, fog_amount));
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;

    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_forward_instanced_colored_unlit(
    gl: WebGL2RenderingContext
): Material<WorldSpaceLayout & InstancedColumnLayout & InstancedColorLayout & FogLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            FogColor: gl.getUniformLocation(program, "fog_color")!,
            FogDistance: gl.getUniformLocation(program, "fog_distance")!,

            InstanceColumn1: gl.getAttribLocation(program, "attr_column1")!,
            InstanceColumn2: gl.getAttribLocation(program, "attr_column2")!,
            InstanceColumn3: gl.getAttribLocation(program, "attr_column3")!,
            InstanceColumn4: gl.getAttribLocation(program, "attr_column4")!,

            InstanceColor: gl.getAttribLocation(program, "attr_color")!,
        },
    };
}
