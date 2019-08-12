import {ShadedAttribute} from "../components/com_render_shaded.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec4 color;
    uniform int light_count;
    uniform vec3 light_positions[10];
    uniform vec4 light_details[10];

    layout(location=${ShadedAttribute.position}) in vec3 position;
    layout(location=${ShadedAttribute.normal}) in vec3 normal;
    flat out vec4 vert_color;

    void main() {
        vec4 world_pos = world * vec4(position, 1.0);
        vec3 world_normal = normalize((vec4(normal, 0.0) * self).xyz);
        gl_Position = pv * world_pos;

        vec3 rgb = vec3(0.0, 0.0, 0.0);
        for (int i = 0; i < light_count; i++) {
            vec3 light_dir = light_positions[i] - world_pos.xyz ;
            vec3 light_normal = normalize(light_dir);
            float light_dist = length(light_dir);

            float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
            float distance_factor = light_dist * light_dist;
            float intensity_factor = light_details[i].a;

            rgb += color.rgb * light_details[i].rgb * diffuse_factor
                    * intensity_factor / distance_factor;
        }

        vert_color = vec4(rgb, 1.0);
    }
`;

let fragment = `#version 300 es
    precision mediump float;

    flat in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_flat(gl: WebGL2RenderingContext) {
    return mat_create(gl, gl.TRIANGLES, vertex, fragment);
}
