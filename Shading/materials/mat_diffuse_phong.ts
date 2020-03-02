import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {DiffuseAttribute} from "../components/com_render_diffuse.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;

    layout(location=${DiffuseAttribute.Position}) in vec3 position;
    layout(location=${DiffuseAttribute.Normal}) in vec3 normal;
    out vec4 vert_pos;
    out vec3 vert_normal;

    void main() {
        vert_pos = world * vec4(position, 1.0);
        vert_normal = (vec4(normal, 1.0) * self).xyz;
        gl_Position = pv * vert_pos;
    }
`;

let fragment = `#version 300 es
    precision mediump float;

    uniform vec4 color;
    uniform int light_count;
    uniform vec3 light_positions[10];
    uniform vec4 light_details[10];

    in vec4 vert_pos;
    in vec3 vert_normal;
    out vec4 frag_color;

    void main() {
        vec3 rgb = vec3(0.0, 0.0, 0.0);
        vec3 frag_normal = normalize(vert_normal);
        for (int i = 0; i < light_count; i++) {
            vec3 light_dir = light_positions[i] - vert_pos.xyz;
            vec3 light_normal = normalize(light_dir);
            float light_dist = length(light_dir);

            float diffuse_factor = max(dot(frag_normal, light_normal), 0.0);
            float distance_factor = light_dist * light_dist;
            float intensity_factor = light_details[i].a;
            float attenuation = distance_factor / intensity_factor;

            rgb += color.rgb * light_details[i].rgb * diffuse_factor / attenuation;
        }

        frag_color = vec4(rgb, 1.0);
    }
`;

export function mat_diffuse_phong(gl: WebGL2RenderingContext) {
    let Program = link(gl, vertex, fragment);
    return <Material>{
        Mode: GL_TRIANGLES,
        Program,
        Uniforms: [
            gl.getUniformLocation(Program, "pv")!,
            gl.getUniformLocation(Program, "world")!,
            gl.getUniformLocation(Program, "self")!,
            gl.getUniformLocation(Program, "color")!,
            gl.getUniformLocation(Program, "light_count")!,
            gl.getUniformLocation(Program, "light_positions")!,
            gl.getUniformLocation(Program, "light_details")!,
        ],
    };
}
