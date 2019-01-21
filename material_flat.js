import Material from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;
    uniform int light_count;
    uniform vec3 light_positions[100];
    uniform vec3 light_colors[100];
    uniform float light_ranges[100];

    in vec3 position;
    in vec3 normal;
    flat out vec4 vert_color;

    void main() {
        vec4 world_pos = model * vec4(position, 1.0);
        vec3 world_normal = normalize((model * vec4(normal, 1.0)).xyz);
        gl_Position = pv * world_pos;

        vec3 rgb = vec3(0.0, 0.0, 0.0);
        for (int i = 0; i < light_count; i++) {
            vec3 light_dir = light_positions[i] - world_pos.xyz ;
            vec3 light_normal = normalize(light_dir);
            float light_dist = length(light_dir);

            float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
            float distance_factor = light_dist * light_dist;
            float intensity_factor = light_ranges[i] * light_ranges[i];

            rgb += color.xyz * light_colors[i] * diffuse_factor * intensity_factor
                    / distance_factor;
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
class FlatMaterial extends Material {
    constructor(gl) {
        super(gl, gl.TRIANGLES, vertex, fragment);
    }

    use(pv, lights) {
        super.use(pv);
        let {gl, uniforms} = this;
        gl.uniform3fv(uniforms.light_positions, lights.positions);
        gl.uniform3fv(uniforms.light_colors, lights.colors);
        gl.uniform1fv(uniforms.light_ranges, lights.ranges);
        gl.uniform1i(uniforms.light_count, lights.count);
    }

    draw(model, render) {
        let {gl, mode, uniforms, attribs} = this;
        gl.uniformMatrix4fv(uniforms.model, gl.FALSE, model);
        gl.uniform4fv(uniforms.color, render.color);
        gl.bindVertexArray(render.vao);
        gl.drawElements(mode, render.count, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
