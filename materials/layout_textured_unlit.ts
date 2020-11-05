export interface TexturedUnlitLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Sampler: WebGLUniformLocation;
    Color: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
}
