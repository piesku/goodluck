import {link, Material} from "../../common/material.js";
import {GL_TRIANGLE_STRIP} from "../../common/webgl.js";
import {Instanced2DLayout} from "./layout_instanced2d.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform vec2 sheet_size;

    // Vertex attributes
    in vec4 attr_position;
    in vec2 attr_texcoord;

    // Instance attributes
    in vec4 attr_rotation; // [a, b, c, d]
    in vec4 attr_translation; // [x, y, z, w: Has.Render]
    in vec4 attr_color;
    in vec4 attr_sprite;

    out vec2 vert_texcoord;
    out vec4 vert_color;
    out vec4 vert_sprite;

    void main() {
        mat4 world = mat4(
            attr_rotation.xy, 0, 0,
            attr_rotation.zw, 0, 0,
            0, 0, 1, 0,
            attr_translation.xyz, 1
        );

        vec4 world_position = world * attr_position;
        gl_Position = pv * world_position;
        if (attr_translation.w == 0.0) {
            gl_Position.z = 2.0;
        }


        // attr_texcoords are +Y=down for compatibility with spritesheet frame coordinates.
        vert_texcoord = (attr_sprite.xy + attr_sprite.zw * attr_texcoord) / sheet_size;
        vert_texcoord.y *= -1.0;
        vert_color = attr_color;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform sampler2D sheet_texture;

    in vec2 vert_texcoord;
    in vec4 vert_color;

    out vec4 frag_color;

    void main() {
        frag_color = vert_color * texture(sheet_texture, vert_texcoord);
        if (frag_color.a == 0.0) {
            discard;
        }
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
            SheetTexture: gl.getUniformLocation(program, "sheet_texture")!,
            SheetSize: gl.getUniformLocation(program, "sheet_size")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexcoord: gl.getAttribLocation(program, "attr_texcoord")!,

            InstanceRotation: gl.getAttribLocation(program, "attr_rotation")!,
            InstanceTranslation: gl.getAttribLocation(program, "attr_translation")!,
            InstanceColor: gl.getAttribLocation(program, "attr_color")!,
            InstanceSprite: gl.getAttribLocation(program, "attr_sprite")!,
        },
    };
}
