import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {TexturedShadedLayout} from "./layout_textured_shaded.js";

let vertex = `
    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec4 color;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    attribute vec3 vert_position;
    attribute vec2 vert_texcoord;
    attribute vec3 vert_normal;

    varying vec2 frag_texcoord;
    varying vec4 frag_color;

    void main() {
        vec4 world_position = world * vec4(vert_position, 1.0);
        vec3 world_normal = normalize((vec4(vert_normal, 1.0) * self).xyz);
        gl_Position = pv * world_position;

        frag_texcoord = vert_texcoord;

        // Ambient light.
        vec3 light_acc = color.rgb * 0.1;

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
                light_acc += color.rgb * diffuse_factor * light_color * light_intensity;
            }
        }

        frag_color = vec4(light_acc, 1.0);
    }
`;

let fragment = `
    precision mediump float;

    uniform sampler2D sampler;

    varying vec2 frag_texcoord;
    varying vec4 frag_color;

    void main() {
        vec4 tex_color = texture2D(sampler, frag_texcoord);
        gl_FragColor = frag_color * tex_color;
    }
`;

export function mat1_textured_gouraud(gl: WebGLRenderingContext): Material<TexturedShadedLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,
            Color: gl.getUniformLocation(program, "color")!,
            Sampler: gl.getUniformLocation(program, "sampler")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,
            VertexPosition: gl.getAttribLocation(program, "vert_position")!,
            VertexTexCoord: gl.getAttribLocation(program, "vert_texcoord")!,
            VertexNormal: gl.getAttribLocation(program, "vert_normal")!,
        },
    };
}
