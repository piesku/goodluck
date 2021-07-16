import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {ForwardInstancedLayout} from "./layout_instancing.js";

let vertex = `#version 300 es\n

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec3 palette[16];

    uniform int light_count;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    in vec3 attr_position;
    in vec3 attr_normal;
    in vec4 attr_offset;

    out vec4 vert_color;

    void main() {
        vec4 world_position = world * vec4(attr_position + attr_offset.xyz, 1.0);
        vec3 world_normal = normalize((vec4(attr_normal, 0.0) * self).xyz);
        gl_Position = pv * world_position;

        // Ambient light.
        vec3 color = palette[int(attr_offset[3])];
        vec3 light_acc = color * 0.1;

        for (int i = 0; i < MAX_LIGHTS; i++) {
            if (light_positions[i].w == 0.0) {
                break;
            }

            vec3 light_color = light_details[i].rgb;
            float light_intensity = light_details[i].a;

            vec3 light_normal;
            if (light_positions[i].w == 1.0) {
                // Directional light.
                light_normal = light_positions[i].xyz;
            } else {
                vec3 light_dir = light_positions[i].xyz - world_position.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(world_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                light_acc += color * diffuse_factor * light_color * light_intensity;
            }
        }

        vert_color = vec4(light_acc, 1.0);
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

export function mat_forward_instanced(
    gl: WebGL2RenderingContext
): Material<ForwardInstancedLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,

            Palette: gl.getUniformLocation(program, "palette")!,

            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexNormal: gl.getAttribLocation(program, "attr_normal")!,
            VertexOffset: gl.getAttribLocation(program, "attr_offset")!,
        },
    };
}
