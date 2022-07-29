import {link, Material} from "../../common/material.js";
import {GL_TRIANGLE_STRIP} from "../../common/webgl.js";
import {Attribute, Instanced2DLayout} from "../../materials/layout2d.js";
import {Has} from "../world.js";

let vertex = `#version 300 es\n
    uniform mat3x2 pv;
    uniform vec2 sheet_size;

    // Vertex attributes
    layout(location=${Attribute.VertexPosition}) in vec2 attr_position;
    layout(location=${Attribute.VertexTexCoord}) in vec2 attr_texcoord;

    // Instance attributes
    layout(location=${Attribute.InstanceRotation}) in vec4 attr_rotation; // [a, b, c, d]
    layout(location=${Attribute.InstanceTranslation}) in vec4 attr_translation; // [x, y, z, w: Signature]
    layout(location=${Attribute.InstanceColor}) in vec4 attr_color;
    layout(location=${Attribute.InstanceSprite}) in vec4 attr_sprite;

    out vec2 vert_texcoord;
    out vec4 vert_color;
    out vec4 vert_sprite;

    void main() {
        int signature = int(attr_translation.w);
        if ((signature & ${Has.Render2D}) == ${Has.Render2D}) {
            mat3x2 world;
            if ((signature & ${Has.SpatialNode2D}) == ${Has.SpatialNode2D}) {
                world = mat3x2(
                    attr_rotation.xy,
                    attr_rotation.zw,
                    attr_translation.xy
                );
            } else {
                vec2 scale = attr_rotation.xy;
                float rotation = attr_rotation.z;
                world = mat3x2(
                    cos(rotation) * scale.x, sin(rotation) * scale.x,
                    -sin(rotation) * scale.y, cos(rotation) * scale.y,
                    attr_translation.xy
                );
            }

            vec3 world_position = mat3(world) * vec3(attr_position, 1);
            vec3 clip_position = mat3(pv) * world_position;
            gl_Position = vec4(clip_position.xy, attr_translation.z, 1);

            // attr_texcoords are +Y=down for compatibility with spritesheet frame coordinates.
            vert_texcoord = (attr_sprite.xy + attr_sprite.zw * attr_texcoord) / sheet_size;
            vert_color = attr_color;
        } else {
            // Place the vertex outside the frustum.
            gl_Position.z = 2.0;
        }
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
        },
    };
}
