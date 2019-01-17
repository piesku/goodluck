import create from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;

    in vec3 position;
    in vec3 normal;
    flat out vec4 vert_color;

    const vec3 light_pos = vec3(-10.0, 10.0, 10.0);
    const vec3 light_color = vec3(1.0, 1.0, 1.0);

    void main() {
        vec4 world_pos = model * vec4(position, 1.0);
        gl_Position = pv * world_pos;

        vec3 world_normal = normalize((model * vec4(normal, 1.0)).xyz);
        vec3 light_dir = normalize(light_pos - world_pos.xyz);
        float light_factor = max(dot(world_normal, light_dir), 0.0);

        vert_color = vec4(color.xyz * light_color * light_factor, 1.0);
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

export default
function create_flat(gl) {
    return create(gl, vertex, fragment, gl.TRIANGLES);
}
