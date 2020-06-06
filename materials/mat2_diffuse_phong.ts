import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {DiffuseLayout} from "./layout_diffuse.js";

let vertex = `#version 300 es\n

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    in vec3 position;
    in vec3 normal;
    out vec4 vert_pos;
    out vec3 vert_normal;

    void main() {
        vert_pos = world * vec4(position, 1.0);
        vert_normal = (vec4(normal, 1.0) * self).xyz;
        gl_Position = pv * vert_pos;
    }
`;

let fragment = `#version 300 es\n

    precision mediump float;

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform vec4 color;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    in vec4 vert_pos;
    in vec3 vert_normal;
    out vec4 frag_color;

    void main() {
        vec3 frag_normal = normalize(vert_normal);

        // Ambient light.
        vec3 rgb = color.rgb * 0.1;

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
                vec3 light_dir = light_positions[i].xyz - vert_pos.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(frag_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                rgb += color.rgb * diffuse_factor * light_color * light_intensity;
            }
        }

        frag_color = vec4(rgb, 1.0);
    }
`;

export function mat2_diffuse_phong(gl: WebGL2RenderingContext): Material<DiffuseLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,
            Color: gl.getUniformLocation(program, "color")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
            VertexNormal: gl.getAttribLocation(program, "normal")!,
        },
    };
}
