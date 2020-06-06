export interface TexturedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    Sampler: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
}
