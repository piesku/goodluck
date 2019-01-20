import Material from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;
    uniform float age;
    uniform int edge;
    uniform float padding;

    in vec3 position;
    in vec3 normal;
    flat out vec4 vert_color;

    const vec3 light_pos = vec3(-100.0, 100.0, 100.0);
    const vec3 light_color = vec3(1.0, 1.0, 1.0);

    vec3 translate(int id) {
        float pad = padding + 2.0 * sin(2.0 * age);
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
class BreathingCubeMaterial extends Material {
    constructor(gl) {
        super(gl, gl.TRIANGLES, vertex, fragment);
    }

    draw(model, render, swarm) {
        let {gl, mode, uniforms, attribs} = this;

        gl.uniformMatrix4fv(uniforms.model, gl.FALSE, model);
        gl.uniform4fv(uniforms.color, render.color);
        gl.uniform1f(uniforms.age, swarm.age);
        gl.uniform1i(uniforms.edge, swarm.edge);
        gl.uniform1f(uniforms.padding, swarm.padding);

        gl.bindVertexArray(render.vao);
        gl.drawElementsInstanced(mode, render.count, gl.UNSIGNED_SHORT, 0,
                swarm.instances);
        gl.bindVertexArray(null);
    }
}
