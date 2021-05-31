import {link, Material} from "../common/material.js";
import {GL_TRIANGLES} from "../common/webgl.js";
import {ForwardShadingLayout} from "./layout_forward_shading.js";
import {TexturedShadedLayout} from "./layout_textured_shaded.js";

let vertex = `
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    attribute vec3 attr_position;
    attribute vec2 attr_texcoord;
    attribute vec3 attr_normal;

    varying vec4 vert_position;
    varying vec2 vert_texcoord;
    varying vec3 vert_normal;

    void main() {
        vert_position = world * vec4(attr_position, 1.0);
        gl_Position = pv * vert_position;

        vert_texcoord = attr_texcoord;
        vert_normal = (vec4(attr_normal, 1.0) * self).xyz;
    }
`;

let fragment = `
    precision mediump float;

    // See Game.LightPositions and Game.LightDetails.
    const int MAX_LIGHTS = 8;

    uniform vec3 eye;
    uniform vec4 diffuse_color;
    uniform vec4 specular_color;
    uniform float shininess;
    uniform sampler2D diffuse_map;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    varying vec4 vert_position;
    varying vec2 vert_texcoord;
    varying vec3 vert_normal;

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

                // Blinn-Phong reflection model.
                if (shininess > 0.0) {
                    vec3 h = normalize(light_normal + view_normal);
                    float specular_angle = max(dot(h, world_normal), 0.0);
                    float specular_factor = pow(specular_angle, shininess);

                    // Specular color.
                    light_acc += specular_color.rgb * specular_factor * light_color * light_intensity;
                }
            }
        }

        vec4 tex_color = texture2D(diffuse_map, vert_texcoord);
        gl_FragColor = vec4(light_acc, 1.0) * tex_color;
    }
`;

export function mat1_forward_textured_phong(
    gl: WebGLRenderingContext
): Material<TexturedShadedLayout & ForwardShadingLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Pv: gl.getUniformLocation(program, "pv")!,
            World: gl.getUniformLocation(program, "world")!,
            Self: gl.getUniformLocation(program, "self")!,

            DiffuseMap: gl.getUniformLocation(program, "diffuse_map")!,
            DiffuseColor: gl.getUniformLocation(program, "diffuse_color")!,
            SpecularColor: gl.getUniformLocation(program, "specular_color")!,
            Shininess: gl.getUniformLocation(program, "shininess")!,

            Eye: gl.getUniformLocation(program, "eye")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,

            VertexPosition: gl.getAttribLocation(program, "attr_position")!,
            VertexTexCoord: gl.getAttribLocation(program, "attr_texcoord")!,
            VertexNormal: gl.getAttribLocation(program, "attr_normal")!,
        },
    };
}
