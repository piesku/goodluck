import {link, Material} from "../../common/material.js";
import {GL_TRIANGLES} from "../../common/webgl.js";
import {InstancedAttribute} from "../components/com_render_instanced.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec3 palette[16];

    uniform int light_count;
    uniform vec3 light_positions[100];
    uniform vec4 light_details[100];

    layout(location=${InstancedAttribute.Position}) in vec3 position;
    layout(location=${InstancedAttribute.Normal}) in vec3 normal;
    layout(location=${InstancedAttribute.Offset}) in vec4 offset;

    out vec4 vert_color;
    void main() {
        vec4 world_pos = world * vec4(position + offset.xyz, 1.0);
        vec3 world_normal = normalize((vec4(normal, 0.0) * self).xyz);
        gl_Position = pv * world_pos;

        vec3 rgb = palette[int(offset[3])].rgb * 0.1;
        for (int i = 0; i < light_count; i++) {
            if (light_details[i].a == 0.0) {
                // A directional light.
                vec3 light_normal = normalize(light_positions[i]);
                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                rgb += palette[int(offset[3])].rgb * light_details[i].rgb * diffuse_factor;
            } else {
                // A point light.
                vec3 light_dir = light_positions[i] - world_pos.xyz ;
                vec3 light_normal = normalize(light_dir);
                float light_dist = length(light_dir);

                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                rgb += palette[int(offset[3])].rgb * light_details[i].rgb * diffuse_factor
                        * light_details[i].a / (light_dist * light_dist);
            }
        }

        vert_color = vec4(rgb, 1.0);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_instanced(GL: WebGL2RenderingContext) {
    let material: Material = {
        Mode: GL_TRIANGLES,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of [
        "pv",
        "world",
        "self",
        "palette",
        "light_count",
        "light_positions",
        "light_details",
    ]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }
    return material;
}
