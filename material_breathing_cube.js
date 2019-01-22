import * as mat4 from "./gl-matrix/mat4.js";
import Material from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform mat4 model_inverse;
    uniform vec4 color;
    uniform int light_count;
    uniform vec3 light_positions[100];
    uniform vec4 light_details[100];
    uniform float age;
    uniform int edge;
    uniform float padding;

    in vec3 position;
    in vec3 normal;
    flat out vec4 vert_color;

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
        vec3 world_normal = normalize((vec4(normal, 0.0) * model_inverse).xyz);
        gl_Position = pv * world_pos;

        vec3 rgb = vec3(0.0, 0.0, 0.0);
        for (int i = 0; i < light_count; i++) {
            vec3 light_dir = light_positions[i] - world_pos.xyz ;
            vec3 light_normal = normalize(light_dir);
            float light_dist = length(light_dir);

            float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
            float distance_factor = light_dist * light_dist;
            float intensity_factor = light_details[i].a * light_details[i].a;

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

export default
class BreathingCubeMaterial extends Material {
    constructor(gl) {
        super(gl, gl.TRIANGLES, vertex, fragment);
    }

    use(pv, lights) {
        super.use(pv);
        let {gl, uniforms} = this;
        gl.uniform3fv(uniforms.light_positions, lights.positions);
        gl.uniform4fv(uniforms.light_details, lights.details);
        gl.uniform1i(uniforms.light_count, lights.count);
    }

    draw(model, render, swarm) {
        let {gl, mode, uniforms, attribs} = this;

        gl.uniformMatrix4fv(uniforms.model, gl.FALSE, model);
        gl.uniformMatrix4fv(uniforms.model_inverse, gl.FALSE,
                mat4.invert([], model));
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
