import {GL_COMPILE_STATUS, GL_FRAGMENT_SHADER, GL_LINK_STATUS, GL_VERTEX_SHADER} from "./webgl.js";

export interface Mesh {
    Vertices: WebGLBuffer;
    Indices: WebGLBuffer;
    Normals: WebGLBuffer;
    Count: number;
}

export interface Material {
    Mode: GLenum;
    Program: WebGLProgram;
    Uniforms: Array<WebGLUniformLocation>;
}

export function link(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
    let program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, GL_VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl, GL_FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, GL_LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program)!);
    }

    return program;
}

function compile(gl: WebGL2RenderingContext, type: GLenum, source: string) {
    let shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader)!);
    }

    return shader;
}
