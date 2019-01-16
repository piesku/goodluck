export default
function create(gl, vertex, fragment, mode) {
    let program = link(gl,
            compile(gl, gl.VERTEX_SHADER, vertex),
            compile(gl, gl.FRAGMENT_SHADER, fragment));
    let {uniforms, attribs} = reflect(gl, program);
    let buffer = shape => create_vao(gl, attribs, shape);
    return {mode, program, uniforms, attribs, buffer};
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
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    return {attribs, uniforms};
}

function create_vao(gl, attribs, {vertices, indices, normals}) {
    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribs.normal);
    gl.vertexAttribPointer(attribs.normal, 3, gl.FLOAT, gl.FALSE,
            0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribs.position);
    gl.vertexAttribPointer(attribs.position, 3, gl.FLOAT, gl.FALSE,
            0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
