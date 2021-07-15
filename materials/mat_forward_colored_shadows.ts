import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {ColoredShadedLayout, ForwardShadingLayout, ShadowMappingLayout} from "./layout.js";

let vertex = `#version 300 es\n

    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    in vec3 attr_position;
    in vec3 attr_normal;

    out vec4 vert_position;
    out vec3 vert_normal;

    void main() {
        vert_position = world * vec4(attr_position, 1.0);
        vert_normal = (vec4(attr_normal, 1.0) * self).xyz;
        gl_Position = pv * vert_position;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    precision lowp sampler2DShadow;

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform vec3 eye;
    uniform vec4 diffuse_color;
    uniform vec4 specular_color;
    uniform float shininess;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];
    uniform mat4 shadow_space;
    uniform sampler2DShadow shadow_map;

    in vec4 vert_position;
    in vec3 vert_normal;

    out vec4 frag_color;

    // How much shadow to apply at world_pos, expressed as [min, 1]:
    // min = completely in shadow, 1 = completely not in shadow
    float shadow_factor(vec4 world_pos, float min) {
        vec4 shadow_space_pos = shadow_space * world_pos;
        vec3 shadow_space_ndc = shadow_space_pos.xyz / shadow_space_pos.w;
        // Transform the [-1, 1] NDC to [0, 1] to match the shadow texture data.
        shadow_space_ndc = shadow_space_ndc * 0.5 + 0.5;

        // Add shadow bias to avoid shadow acne.
        shadow_space_ndc.z -= 0.001;

        return texture(shadow_map, shadow_space_ndc) * (1.0 - min) + min;
    }

    void main() {
        vec3 world_normal = normalize(vert_normal);

        vec3 view_dir = eye - vert_position.xyz;
        vec3 view_normal = normalize(view_dir);

        // Ambient light.
        vec3 light_acc = diffuse_color.rgb * 0.1;

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
                vec3 light_dir = light_positions[i].xyz - vert_position.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(world_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                light_acc += diffuse_color.rgb * diffuse_factor * light_color * light_intensity;

                if (shininess > 0.0) {
                    // Phong reflection model.
                    // vec3 r = reflect(-light_normal, world_normal);
                    // float specular_angle = max(dot(r, view_normal), 0.0);
                    // float specular_factor = pow(specular_angle, shininess);

                    // Blinn-Phong reflection model.
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, world_normal), 0.0);
                    float specular_factor = pow(specular_angle, shininess);

                    // Specular color.
                    light_acc += specular_color.rgb * specular_factor * light_color * light_intensity;
                }
            }
        }

        vec3 shaded_rgb = light_acc * shadow_factor(vert_position, 0.5);
        frag_color= vec4(shaded_rgb, 1.0);
    }
`;

export function mat_forward_colored_shadows(
    gl: WebGL2RenderingContext
): Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout> {
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

            Eye: gl.getUniformLocation(program, "eye")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            ShadowSpace: gl.getUniformLocation(program, "shadow_space")!,
            ShadowMap: gl.getUniformLocation(program, "shadow_map")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexNormal: gl.getAttribLocation(program, "attr_normal")!,
        },
    };
}
