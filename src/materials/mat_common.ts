export interface Shape {
    Vertices: Float32Array;
    Indices: Uint16Array;
    Normals: Float32Array;
}

export interface Material {
    GL: WebGL2RenderingContext;
    Mode: GLint;
    Program: WebGLProgram;
    Uniforms: Record<string, WebGLUniformLocation>;
}

export function mat_create(
    GL: WebGL2RenderingContext,
    Mode: GLint,
    vertex: string,
    fragment: string
) {
    let material: Material = {
        GL,
        Mode,
        Program: link(GL, vertex, fragment),
        Uniforms: {},
    };

    // Reflect uniforms.
    let uniform_count = GL.getProgramParameter(material.Program, GL.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniform_count; ++i) {
        let {name} = GL.getActiveUniform(material.Program, i)!;
        // Array uniforms are named foo[0]; strip the [0] part.
        material.Uniforms[name.replace(/\[0\]$/, "")] = GL.getUniformLocation(
            material.Program,
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
