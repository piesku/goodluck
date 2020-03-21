import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {TextureAttribute} from "../components/com_render_texture.js";

let vertex = `#version 300 es\n

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    layout(location=${TextureAttribute.Position}) in vec3 position;
    layout(location=${TextureAttribute.Normal}) in vec3 normal;
    layout(location=${TextureAttribute.TextureCoord}) in vec2 texture_coord;

    out vec2 vert_texture_coord;

    void main() {
        vec4 vert_pos = world * vec4(position, 1.0);
        vec3 vert_normal = normalize((vec4(normal, 1.0) * self).xyz);
        gl_Position = pv * vert_pos;

        vert_texture_coord = texture_coord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec2 vert_texture_coord;
    out vec4 frag_color;

    uniform sampler2D sampler;

    void main() {
        frag_color = texture(sampler, vert_texture_coord);
    }
`;

export function mat_diffuse_gouraud(gl: WebGL2RenderingContext) {
    let Program = link(gl, vertex, fragment);
    return <Material>{
        Mode: GL_TRIANGLES,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "self")!,
            gl.getUniformLocation(Program, "sampler")!,
            gl.getUniformLocation(Program, "light_positions")!,
            gl.getUniformLocation(Program, "light_details")!,
        ],
    };
}
