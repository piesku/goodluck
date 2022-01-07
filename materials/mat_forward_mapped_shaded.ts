import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {Attribute, ForwardShadingLayout, MappedShadedLayout} from "./layout.js";
import {INCLUDE_GAMMA_CORRECTION, LightKind, MAX_FORWARD_LIGHTS} from "./light.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${Attribute.Position}) in vec4 attr_position;
    layout(location=${Attribute.Normal}) in vec3 attr_normal;
    layout(location=${Attribute.TexCoord}) in vec2 attr_texcoord;
    layout(location=${Attribute.Tangent}) in vec3 attr_tangent;
    layout(location=${Attribute.Bitangent}) in vec3 attr_bitangent;

    out vec4 vert_position;
    out vec2 vert_texcoord;
    out vec3 vert_normal;
    out mat3 vert_tbn;

    void main() {
        vert_position = world * attr_position;
        gl_Position = pv * vert_position;

        vert_texcoord = attr_texcoord;
        vert_tbn = mat3(attr_tangent, attr_bitangent, attr_normal);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    uniform mat4 self;

    uniform vec4 diffuse_color;
    uniform sampler2D diffuse_map;
    uniform sampler2D normal_map;
    uniform sampler2D roughness_map;

    uniform vec3 eye;
    uniform vec4 light_positions[${MAX_FORWARD_LIGHTS}];
    uniform vec4 light_details[${MAX_FORWARD_LIGHTS}];

    in vec4 vert_position;
    in vec2 vert_texcoord;
    in vec3 vert_normal;
    in mat3 vert_tbn;

    out vec4 frag_color;

    ${INCLUDE_GAMMA_CORRECTION}

    void main() {
        vec3 tex_normal = texture(normal_map, vert_texcoord).rgb;
        vec3 frag_normal = vert_tbn * normalize(tex_normal * 2.0 - 1.0);
        vec3 world_normal = (vec4(frag_normal, 1.0) * self).xyz;

        vec3 view_dir = eye - vert_position.xyz;
        vec3 view_normal = normalize(view_dir);

        vec4 tex_color = GAMMA_DECODE(texture(diffuse_map, vert_texcoord));
        vec3 unlit_rgb = tex_color.rgb * GAMMA_DECODE(diffuse_color.rgb);

        // Ambient light.
        vec3 light_acc = unlit_rgb * 0.1;

        for (int i = 0; i < ${MAX_FORWARD_LIGHTS}; i++) {
            int light_kind = int(light_positions[i].w);
            if (light_kind == ${LightKind.Inactive}) {
                break;
            }

            vec3 light_rgb = GAMMA_DECODE(light_details[i].rgb);
            float light_intensity = light_details[i].a;

            vec3 light_normal;
            if (light_kind == ${LightKind.Directional}) {
                light_normal = light_positions[i].xyz;
            } else if (light_kind == ${LightKind.Point}) {
                vec3 light_dir = light_positions[i].xyz - vert_position.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(world_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                light_acc += unlit_rgb * diffuse_factor * light_rgb * light_intensity;

                // Blinn-Phong reflection model.
                float roughness = texture(roughness_map, vert_texcoord).x;
                if (roughness < 1.0) {
                    float shininess = 1.0 / pow(roughness, 3.0) - 1.0;
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, world_normal), 0.0);
                    float specular_factor = pow(specular_angle, shininess);

                    // Specular color.
                    light_acc += unlit_rgb * specular_factor * light_rgb * light_intensity;
                }
            }
        }

        frag_color = vec4(GAMMA_ENCODE(light_acc), diffuse_color.a);
    }
`;

export function mat_forward_mapped_shaded(
    gl: WebGL2RenderingContext
): Material<MappedShadedLayout & ForwardShadingLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,

            DiffuseColor: gl.getUniformLocation(program, "diffuse_color")!,
            DiffuseMap: gl.getUniformLocation(program, "diffuse_map")!,
            NormalMap: gl.getUniformLocation(program, "normal_map")!,
            RoughnessMap: gl.getUniformLocation(program, "roughness_map")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,
        },
    };
}
