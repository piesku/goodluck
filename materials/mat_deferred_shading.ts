import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {DeferredPostprocessLayout, ForwardShadingLayout, ShadowMappingLayout} from "./layout.js";

let vertex = `#version 300 es\n
    in vec3 attr_position;
    in vec2 attr_texcoord;

    out vec2 vert_texcoord;

    void main() {
        gl_Position = vec4(attr_position, 1.0);
        vert_texcoord = attr_texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    precision lowp sampler2DShadow;

    const int MAX_LIGHTS = 64;

    uniform vec3 eye;
    uniform sampler2D diffuse_map;
    uniform sampler2D specular_map;
    uniform sampler2D position_map;
    uniform sampler2D normal_map;
    uniform sampler2D depth_map;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];
    uniform mat4 shadow_space;
    uniform sampler2DShadow shadow_map;

    in vec2 vert_texcoord;

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
        vec3 current_normal = texture(normal_map, vert_texcoord).xyz;
        if (current_normal == vec3(0.0, 0.0, 0.0)) {
            // "Black" normals identify fragments with no renderable objects; clear color them.
            discard;
        }

        vec4 current_diffuse = texture(diffuse_map, vert_texcoord);
        vec4 current_specular = texture(specular_map, vert_texcoord);
        vec4 current_position = texture(position_map, vert_texcoord);

        vec3 view_dir = eye - current_position.xyz;
        vec3 view_normal = normalize(view_dir);

        // Ambient light.
        vec3 light_acc = current_diffuse.rgb * 0.1;

        for (int i = 0; i < MAX_LIGHTS; i++) {
            int light_kind = int(light_positions[i].w);
            if (light_kind == 0) {
                // The first inactive light means we're done.
                break;
            }

            vec3 light_rgb = light_details[i].rgb;
            float light_intensity = light_details[i].a;

            vec3 light_normal;
            if (light_kind == 1) {
                // Directional light.
                light_normal = light_positions[i].xyz;
            } else if (light_kind == 2) {
                // Point light.
                vec3 light_dir = light_positions[i].xyz - current_position.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(current_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                light_acc += current_diffuse.rgb * diffuse_factor * light_rgb * light_intensity;

                if (current_specular.a > 0.0) {
                    // For non-zero shininess, apply the Blinn-Phong reflection model.
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, current_normal), 0.0);
                    float specular_factor = pow(specular_angle, current_specular.a);

                    // Specular color.
                    light_acc += current_specular.rgb * specular_factor * light_rgb * light_intensity;
                }
            }
        }

        vec3 shaded_rgb = light_acc * shadow_factor(current_position, 0.5);
        frag_color = vec4(shaded_rgb, 1.0);
    }
`;

export function mat_deferred_shading(
    gl: WebGL2RenderingContext
): Material<DeferredPostprocessLayout & ForwardShadingLayout & ShadowMappingLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            DiffuseMap: gl.getUniformLocation(program, "diffuse_map")!,
            SpecularMap: gl.getUniformLocation(program, "specular_map")!,
            PositionMap: gl.getUniformLocation(program, "position_map")!,
            NormalMap: gl.getUniformLocation(program, "normal_map")!,
            DepthMap: gl.getUniformLocation(program, "depth_map")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            ShadowSpace: gl.getUniformLocation(program, "shadow_space")!,
            ShadowMap: gl.getUniformLocation(program, "shadow_map")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexcoord: gl.getAttribLocation(program, "attr_texcoord")!,
        },
    };
}
