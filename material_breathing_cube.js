import create from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;
    uniform float timestamp;
    uniform int edge;
    uniform float padding;

    in vec3 position;
    in vec3 normal;
    flat out vec4 vert_color;

    const vec3 light_pos = vec3(-100.0, 100.0, 100.0);
    const vec3 light_color = vec3(1.0, 1.0, 1.0);

    vec3 translate(int id) {
        float pad = padding + 2.0 * sin(2.0 * timestamp);
        float offset = -0.5 * float(edge) * pad;
        return vec3(
            offset + pad * float(id % edge),
            offset + pad * float((id / edge) % edge),
            offset + pad * float((id / (edge * edge)) % edge));
    }

    void main() {
        vec3 translation = translate(gl_InstanceID);
        vec4 world_pos = model * vec4(position + translation, 1.0);
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
function FlatSimpleParticles(gl) {
    return create(gl, vertex, fragment, gl.TRIANGLES);
}
