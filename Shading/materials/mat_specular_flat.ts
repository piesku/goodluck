import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {SpecularAttribute} from "../components/com_render_specular.js";

let vertex = `#version 300 es

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec3 eye;
    uniform vec4 color_diffuse;
    uniform vec4 color_specular;
    uniform float shininess;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    layout(location=${SpecularAttribute.Position}) in vec3 position;
    layout(location=${SpecularAttribute.Normal}) in vec3 normal;
    flat out vec4 vert_color;

    void main() {
        vec4 vert_pos = world * vec4(position, 1.0);
        vec3 vert_normal = normalize((vec4(normal, 1.0) * self).xyz);
        gl_Position = pv * vert_pos;

        vec3 view_dir = eye - vert_pos.xyz;
        vec3 view_normal = normalize(view_dir);

        // Ambient light.
        vec3 rgb = color_diffuse.rgb * 0.1;

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

            float diffuse_factor = dot(vert_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                rgb += color_diffuse.rgb * diffuse_factor * light_color * light_intensity;

                // Blinn-Phong reflection model.
                vec3 h = normalize(light_normal + view_normal);
                float specular_angle = max(dot(h, vert_normal), 0.0);
                float specular_factor = pow(specular_angle, shininess);

                // Specular color.
                rgb += color_specular.rgb * specular_factor * light_color * light_intensity;
            }
        }

        vert_color = vec4(rgb, 1.0);
    }
`;

let fragment = `#version 300 es
    precision mediump float;

    flat in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_specular_flat(gl: WebGL2RenderingContext) {
    let Program = link(gl, vertex, fragment);
    return <Material>{
        Mode: GL_TRIANGLES,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "self")!,
            gl.getUniformLocation(Program, "eye")!,
            gl.getUniformLocation(Program, "color_diffuse")!,
            gl.getUniformLocation(Program, "color_specular")!,
            gl.getUniformLocation(Program, "shininess")!,
            gl.getUniformLocation(Program, "light_positions")!,
            gl.getUniformLocation(Program, "light_details")!,
        ],
    };
}
