export default
class Material {
    constructor(gl, mode, vertex, fragment) {
        this.gl = gl;
        this.mode = mode;
        this.program = link(gl,
            compile(gl, gl.VERTEX_SHADER, vertex),
            compile(gl, gl.FRAGMENT_SHADER, fragment));
        Object.assign(this, reflect(gl, this.program));
    }

    use(pv) {
        let {gl, program, uniforms} = this;
        gl.useProgram(program);
        gl.uniformMatrix4fv(uniforms.pv, gl.FALSE, pv);
    }

    create_vao({vertices, indices, normals}) {
        let {gl, attribs} = this;
        let vao = gl.createVertexArray()
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attribs.normal);
        gl.vertexAttribPointer(attribs.normal, 3, gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attribs.position);
        gl.vertexAttribPointer(attribs.position, 3, gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }
}

function create(gl, vertex, fragment, mode) {
    let {uniforms, attribs} = reflect(gl, program);
    return {gl, mode, program, uniforms, attribs};
}

function compile(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

function link(gl, vertex, fragment) {
  let program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

function reflect(gl, program) {
    let attribs = {};
    let attrib_count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attrib_count; ++i) {
      let {name} = gl.getActiveAttrib(program, i);
      attribs[name] = gl.getAttribLocation(program, name);
    }

    let uniforms = {};
    let uniform_count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniform_count; ++i) {
      let {name} = gl.getActiveUniform(program, i);
      // Array uniforms are named foo[0]; strip the [0] part.
      uniforms[name.replace(/\[0\]$/, "")] = gl.getUniformLocation(program, name);
    }

    return {attribs, uniforms};
}
