export interface Shape {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
}

export interface Material {
    gl: WebGL2RenderingContext;
    mode: GLint;
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation>;
}

export function mat_create(
    gl: WebGL2RenderingContext,
    mode: GLint,
    vertex: string,
    fragment: string
) {
    let material: Material = {
        gl: gl,
        mode: mode,
        program: link(gl, vertex, fragment),
        uniforms: {},
    };

    // Reflect uniforms.
    material.uniforms = {};
    let uniform_count = gl.getProgramParameter(material.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniform_count; ++i) {
        let {name} = gl.getActiveUniform(material.program, i)!;
        // Array uniforms are named foo[0]; strip the [0] part.
        material.uniforms[name.replace(/\[0\]$/, "")] = gl.getUniformLocation(
            material.program,
            name
        )!;
    }

    return material;
}

function link(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
    let program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program)!);
    }

    return program;
}

function compile(gl: WebGL2RenderingContext, type: GLint, source: string) {
    let shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader)!);
    }

    return shader;
}
