import Material from "./material.js";

let vertex = `#version 300 es
    uniform mat4 pv;
    uniform mat4 model;

    in vec3 position;

    void main() {
        gl_Position = pv * model * vec4(position, 1.0);
        gl_PointSize = 2.0;
    }
`;

let fragment = `#version 300 es
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export default
class PointsMaterial extends Material {
    constructor(gl) {
        super(gl, gl.POINTS, vertex, fragment);
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
