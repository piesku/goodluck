import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {Attribute, ColoredShadedLayout, ForwardShadingLayout} from "../../materials/layout.js";
import {INCLUDE_GAMMA_CORRECTION, LightKind, MAX_FORWARD_LIGHTS} from "../../materials/light.js";
import {SkinningLayout} from "./layout_skinning.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec3 eye;
    uniform vec4 diffuse_color;
    uniform vec4 specular_color;
    uniform vec4 emissive_color;
    uniform vec4 light_positions[${MAX_FORWARD_LIGHTS}];
    uniform vec4 light_details[${MAX_FORWARD_LIGHTS}];
    uniform mat4 bones[6];

    layout(location=${Attribute.Position}) in vec4 attr_position;
    layout(location=${Attribute.Normal}) in vec3 attr_normal;
    layout(location=${Attribute.Weights}) in vec4 attr_weights;

    out vec4 vert_color;

    ${INCLUDE_GAMMA_CORRECTION}

    mat4 world_weighted(vec4 weights) {
        return weights[1] * bones[int(weights[0])] + weights[3] * bones[int(weights[2])];
    }

    void main() {
        mat4 bone_world = world_weighted(attr_weights);
        vec4 world_position = bone_world * attr_position;
        vec3 world_normal = normalize((bone_world * vec4(attr_normal, 0.0)).xyz);
        gl_Position = pv * world_position;

        vec3 view_dir = eye - world_position.xyz;
        vec3 view_normal = normalize(view_dir);

        // Ambient light.
        vec3 light_acc = GAMMA_DECODE(diffuse_color.rgb) * 0.1;

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
                vec3 light_dir = light_positions[i].xyz - world_position.xyz;
                float light_dist = length(light_dir);
                light_normal = light_dir / light_dist;
                // Distance attenuation.
                light_intensity /= (light_dist * light_dist);
            }

            float diffuse_factor = dot(world_normal, light_normal);
            if (diffuse_factor > 0.0) {
                // Diffuse color.
                light_acc += GAMMA_DECODE(diffuse_color.rgb) * diffuse_factor * light_rgb * light_intensity;

                if (specular_color.a > 0.0) {
                    // Blinn-Phong reflection model.
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, world_normal), 0.0);
                    float specular_factor = pow(specular_angle, specular_color.a);

                    // Specular color.
                    light_acc += GAMMA_DECODE(specular_color.rgb) * specular_factor * light_rgb * light_intensity;
                }
            }
        }

        vec3 emissive_rgb = GAMMA_DECODE(emissive_color.rgb) * emissive_color.a;
        vert_color = vec4(light_acc + emissive_rgb, diffuse_color.a);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;

    out vec4 frag_color;

    ${INCLUDE_GAMMA_CORRECTION}

    void main() {
        frag_color = GAMMA_ENCODE(vert_color);
    }
`;

export function mat_forward_colored_gouraud_skinned(
    gl: WebGL2RenderingContext
): Material<ColoredShadedLayout & ForwardShadingLayout & SkinningLayout> {
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
            EmissiveColor: gl.getUniformLocation(program, "emissive_color")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            Bones: gl.getUniformLocation(program, "bones")!,
        },
    };
}
