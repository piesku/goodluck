import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {ForwardShadingLayout, MappedShadedLayout} from "./layout.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;

    attribute vec3 attr_position;
    attribute vec2 attr_texcoord;
    attribute vec3 attr_normal;
    attribute vec3 attr_tangent;
    attribute vec3 attr_bitangent;

    varying vec4 vert_position;
    varying vec2 vert_texcoord;
    varying vec3 vert_normal;
    varying mat3 vert_tbn;

    void main() {
        vert_position = world * vec4(attr_position, 1.0);
        gl_Position = pv * vert_position;

        vert_texcoord = attr_texcoord;
        vert_tbn = mat3(attr_tangent, attr_bitangent, attr_normal);
    }
`;

let fragment = `
    precision mediump float;

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform mat4 self;

    uniform vec4 diffuse_color;
    uniform sampler2D diffuse_map;
    uniform sampler2D normal_map;
    uniform sampler2D roughness_map;

    uniform vec3 eye;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    varying vec4 vert_position;
    varying vec2 vert_texcoord;
    varying vec3 vert_normal;
    varying mat3 vert_tbn;

    void main() {
        vec3 tex_normal = texture2D(normal_map, vert_texcoord).rgb;
        vec3 frag_normal = vert_tbn * normalize(tex_normal * 2.0 - 1.0);
        vec3 world_normal = (vec4(frag_normal, 1.0) * self).xyz;

        vec3 view_dir = eye - vert_position.xyz;
        vec3 view_normal = normalize(view_dir);

        vec4 tex_color = texture2D(diffuse_map, vert_texcoord);
        vec3 unlit_rgb = tex_color.rgb * diffuse_color.rgb;

        // Ambient light.
        vec3 light_acc = unlit_rgb * 0.1;

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
                light_acc += unlit_rgb * diffuse_factor * light_color * light_intensity;

                // Blinn-Phong reflection model.
                float roughness = texture2D(roughness_map, vert_texcoord).x;
                if (roughness < 1.0) {
                    float shininess = 1.0 / pow(roughness, 3.0) - 1.0;
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, world_normal), 0.0);
                    float specular_factor = pow(specular_angle, shininess);

                    // Specular color.
                    light_acc += unlit_rgb * specular_factor * light_color * light_intensity;
                }
            }
        }

        gl_FragColor = vec4(light_acc, 1.0);
    }
`;

export function mat1_forward_mapped_shaded(
    gl: WebGLRenderingContext
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

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexCoord: gl.getAttribLocation(program, "attr_texcoord")!,
            VertexNormal: gl.getAttribLocation(program, "attr_normal")!,
            VertexTangent: gl.getAttribLocation(program, "attr_tangent")!,
            VertexBitangent: gl.getAttribLocation(program, "attr_bitangent")!,
        },
    };
}
