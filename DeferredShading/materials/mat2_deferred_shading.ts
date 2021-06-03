import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {ShadowMappingLayout} from "../../ForwardShadows/materials/layout_shadow_mapping.js";
import {ForwardShadingLayout} from "../../materials/layout_forward_shading.js";
import {DeferredPostprocessLayout} from "./layout_deferred_postprocess.js";

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

    const int MAX_LIGHTS = 8;

    uniform vec3 eye;
    uniform sampler2D diffuse_map;
    uniform sampler2D specular_map;
    uniform sampler2D position_map;
    uniform sampler2D normal_map;
    uniform sampler2D depth_map;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];
    uniform mat4 shadow_space;
    uniform sampler2D shadow_map;

    in vec2 vert_texcoord;

    out vec4 frag_color;

    float shadow_factor(vec4 world_pos) {
        vec4 shadow_space_pos = shadow_space * world_pos;
        vec3 shadow_space_ndc = shadow_space_pos.xyz / shadow_space_pos.w;
        // Transform the [-1, 1] NDC to [0, 1] to match the shadow texture data.
        shadow_space_ndc = shadow_space_ndc * 0.5 + 0.5;

        float shadow_bias = 0.001;
        float shadow_acc = 0.0;
        float texel_size = 1.0 / 2048.0;

        // Sample 9 surrounding texels to anti-alias the shadow a bit.
        for (int u = -1; u <= 1; u++) {
            for (int v = -1; v <= 1; v++) {
                float shadow_map_depth = texture(shadow_map, shadow_space_ndc.xy + vec2(u, v) * texel_size).x;
                shadow_acc += shadow_space_ndc.z - shadow_bias > shadow_map_depth ? 0.5 : 0.0;
            }
        }
        return shadow_acc / 9.0;
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

        vec3 shaded_rgb = light_acc * (1.0 - shadow_factor(current_position));
        frag_color = vec4(shaded_rgb, 1.0);
    }
`;

export function mat2_deferred_shading(
    gl: WebGLRenderingContext
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
