import Material from "./mat_common.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;
    uniform vec4 color;

    in vec3 position;
    in vec3 normal;
    out vec4 vert_color;

    void main() {
        gl_Position = pv * model * vec4(position, 1.0);
        vert_color = color;
    }
`;

let fragment = `#version 300 es
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export default
class BasicMaterial extends Material {
    constructor(gl) {
        super(gl, gl.TRIANGLES, vertex, fragment);
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
