export function compile(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

export function link(gl, vertex, fragment) {
  let program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

export function reflect(gl, program) {
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
