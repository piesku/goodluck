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

    uniform vec2 dimensions;
    uniform mat4 eye_world;
    uniform mat4 eye_unprojection;
    uniform sampler2D color_map;
    uniform sampler2D normal_map;
    uniform sampler2D depth_map;
    uniform vec4 light_positions[MAX_LIGHTS];
    uniform vec4 light_colors[MAX_LIGHTS];
    uniform vec4 light_directions[MAX_LIGHTS];

    in vec2 vert_texcoord;
    out vec4 frag_color;

    const vec4 edge_color = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 normal_at(vec2 uv) {
        return texture(normal_map, uv).xyz * 2.0 - 1.0;
    }

    float depth_at(vec2 uv) {
        return texture(depth_map, uv).x;
    }

    vec3 world_position_at(vec2 uv, float z) {
        vec4 clip_position = vec4(uv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0);
        vec4 view_position = eye_unprojection * clip_position;
        view_position /= view_position.w;
        vec4 world_position = eye_world * view_position;
        return world_position.xyz;
    }

    void main() {
        vec4 current_color = texture(color_map, vert_texcoord);
        vec3 current_normal = normal_at(vert_texcoord);
        float current_depth = depth_at(vert_texcoord);
        vec3 current_position = world_position_at(vert_texcoord, current_depth);

        for (int i = 0; i < MAX_LIGHTS; i++) {
            int light_kind = int(light_positions[i].w);
            if (light_kind == 0) {
                /* LIGHT_OFF */
                break;
            }

            vec3 light_diff = light_positions[i].xyz - current_position;
            float light_dist = length(light_diff);
            float light_range = light_colors[i].a;
            if (light_dist > light_range) {
                continue;
            }

            vec3 light_normal = light_diff / light_dist;
            float diffuse_factor = dot(current_normal, light_normal);
            if (diffuse_factor < 0.0) {
                continue;
            }

            if (light_kind == 2) {
                /* LIGHT_SPOT */
                vec3 light_forward = light_directions[i].xyz;
                float light_angle = light_directions[i].w;
                float current_cos = dot(light_forward, -light_normal);
                if (current_cos < cos(light_angle / 2.0)) {
                    continue;
                }
            }

            vec3 light_color = light_colors[i].rgb;
            current_color = vec4(light_color, 1.0);
        }

        vec2 offsets[4] = vec2[](
                vec2(-1, -1) / dimensions,
                vec2(1, -1) / dimensions,
                vec2(-1, 1) / dimensions,
                vec2(1, 1) / dimensions
        );

        vec3 n1 = normal_at(vert_texcoord + offsets[0])
                - normal_at(vert_texcoord + offsets[3]);
        vec3 n2 = normal_at(vert_texcoord + offsets[1])
                - normal_at(vert_texcoord + offsets[2]);
        float n = sqrt(dot(n1, n1) + dot(n2, n2));

        if (n > 1.0) {
            frag_color = edge_color;
        } else {
            float d1 = depth_at(vert_texcoord + offsets[0])
                    - depth_at(vert_texcoord + offsets[3]);
            float d2 = depth_at(vert_texcoord + offsets[1])
                    - depth_at(vert_texcoord + offsets[2]);
            float z = sqrt(d1 * d1 + d2 * d2);
            frag_color = mix(current_color, edge_color, step(0.01 / current_depth, z));
        }
    }
`;

export function mat2_deferred_postprocess_outline(
    gl: WebGLRenderingContext
): Material<DeferredPostprocessLayout> {
    let program = link(gl, vertex, fragment);
    return {
        Mode: GL_TRIANGLES,
        Program: program,
        Locations: {
            Dimensions: gl.getUniformLocation(program, "dimensions")!,
            EyeWorld: gl.getUniformLocation(program, "eye_world")!,
            EyeUnprojection: gl.getUniformLocation(program, "eye_unprojection")!,
            ColorMap: gl.getUniformLocation(program, "color_map")!,
            NormalMap: gl.getUniformLocation(program, "normal_map")!,
            DepthMap: gl.getUniformLocation(program, "depth_map")!,
            LightPositions: gl.getUniformLocation(program, "light_positions")!,
            LightColors: gl.getUniformLocation(program, "light_colors")!,
            LightDirections: gl.getUniformLocation(program, "light_directions")!,
            VertexPosition: gl.getAttribLocation(program, "position")!,
            VertexTexcoord: gl.getAttribLocation(program, "texcoord")!,
        },
    };
}
