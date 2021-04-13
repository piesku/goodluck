import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {DeferredPostprocessLayout} from "./layout_deferred_postprocess.js";

let vertex = `#version 300 es\n
    in vec3 position;
    in vec2 texcoord;
    out vec2 vert_texcoord;

    void main() {
        gl_Position = vec4(position, 1.0);
        vert_texcoord = texcoord;
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    const int MAX_LIGHTS = 8;

    uniform sampler2D diffuse_map;
    uniform sampler2D position_map;
    uniform sampler2D normal_map;
    uniform sampler2D depth_map;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_details[MAX_LIGHTS];

    in vec2 vert_texcoord;
    out vec4 frag_color;

    void main() {
        vec3 current_normal = texture(normal_map, vert_texcoord).xyz;
        if (current_normal == vec3(0.0, 0.0, 0.0)) {
            // "Black" normals identify fragments with no renderable objects; clear color them.
            discard;
        }

        vec4 current_color = texture(diffuse_map, vert_texcoord);
        vec4 current_position = texture(position_map, vert_texcoord);

        // Ambient light.
        vec3 rgb = current_color.rgb * 0.1;

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
                rgb += current_color.rgb * diffuse_factor * light_rgb * light_intensity;
            }
        }

        frag_color = vec4(rgb, 1.0);
    }
`;

export function mat2_deferred_post_shading(
    gl: WebGLRenderingContext
): Material<DeferredPostprocessLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            DiffuseMap: gl.getUniformLocation(program, "diffuse_map")!,
            PositionMap: gl.getUniformLocation(program, "position_map")!,
            NormalMap: gl.getUniformLocation(program, "normal_map")!,
            DepthMap: gl.getUniformLocation(program, "depth_map")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightDetails: gl.getUniformLocation(program, "light_details")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
            VertexTexcoord: gl.getAttribLocation(program, "texcoord")!,
        },
    };
}
