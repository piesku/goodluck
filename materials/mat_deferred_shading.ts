import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, DeferredShadingLayout, ShadowMappingLayout, WorldSpaceLayout} from "./layout.js";
import {INCLUDE_GAMMA_CORRECTION, LightKind} from "./light.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform lowp ivec2 light_kind; // x: kind, y: is shadow source

    layout(location=${Attribute.Position}) in vec4 attr_position;

    out vec4 light_position;
    out vec3 light_direction;
    out vec4 vert_position;

    void main() {
        light_position = world[3];
        light_direction = normalize(world[2].xyz);

        if (light_kind.x < ${LightKind.Point}) {
            // Ambient or directional light.
            vert_position = attr_position;
        } else {
            // Point light.
            vert_position = pv * world * attr_position;
        }

        gl_Position = vert_position;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    precision lowp sampler2DShadow;

    uniform vec3 eye;
    uniform sampler2D diffuse_map;
    uniform sampler2D specular_map;
    uniform sampler2D emissive_map;
    uniform sampler2D position_map;
    uniform sampler2D normal_map;
    uniform sampler2D depth_map;
    uniform lowp ivec2 light_kind; // x: kind, y: is shadow source
    uniform vec4 light_details; // rgb, a: intensity
    uniform mat4 shadow_space;
    uniform sampler2DShadow shadow_map;

    in vec4 light_position;
    in vec3 light_direction;
    in vec4 vert_position;

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

    ${INCLUDE_GAMMA_CORRECTION}

    void main() {
        vec2 uv = vert_position.xy / vert_position.w * 0.5 + 0.5;
        vec3 current_normal = texture(normal_map, uv).xyz;
        if (current_normal == vec3(0.0, 0.0, 0.0)) {
            // "Black" normals identify fragments with no renderable objects; clear color them.
            discard;
        }

        vec4 current_diffuse = texture(diffuse_map, uv);
        vec4 current_specular = texture(specular_map, uv);
        vec4 current_position = texture(position_map, uv);

        vec3 view_dir = eye - current_position.xyz;
        vec3 view_normal = normalize(view_dir);

        vec3 light_rgb = GAMMA_DECODE(light_details.rgb);
        float light_intensity = light_details.a;

        if (light_kind.x == ${LightKind.Ambient}) {
            vec3 emissive_rgb = current_diffuse.rgb * current_diffuse.a;
            frag_color = vec4(emissive_rgb + current_diffuse.rgb * light_rgb * light_intensity, 1.0);
            return;
        }

        vec3 light_acc = vec3(0.0);
        vec3 light_normal;

        if (light_kind.x == ${LightKind.Directional}) {
            // Directional lights shine backwards, to match the way cameras work.
            // Add a depth camera to the light entity to make it a shadow source.
            light_normal = light_direction;
        } else {
            // Point light.
            vec3 light_dir = light_position.xyz - current_position.xyz;
            float light_dist = length(light_dir);
            light_normal = light_dir / light_dist;
            // Distance attenuation.
            light_intensity /= pow(light_dist, 2.0);
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

        if (light_kind.y == 1) {
            // The light is a shadow source.
            vec3 shaded_rgb = light_acc * shadow_factor(current_position, 0.0);
            frag_color = vec4(shaded_rgb, 1.0);
        } else {
            frag_color = vec4(light_acc, 1.0);
        }
    }
`;

export function mat_deferred_shading(
    gl: WebGL2RenderingContext
): Material<WorldSpaceLayout & DeferredShadingLayout & ShadowMappingLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,

            DiffuseMap: gl.getUniformLocation(program, "diffuse_map")!,
            SpecularMap: gl.getUniformLocation(program, "specular_map")!,
            EmissiveMap: gl.getUniformLocation(program, "emissive_map")!,
            PositionMap: gl.getUniformLocation(program, "position_map")!,
            NormalMap: gl.getUniformLocation(program, "normal_map")!,
            DepthMap: gl.getUniformLocation(program, "depth_map")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            LightKind: gl.getUniformLocation(program, "light_kind")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            ShadowSpace: gl.getUniformLocation(program, "shadow_space")!,
            ShadowMap: gl.getUniformLocation(program, "shadow_map")!,
        },
    };
}
