export interface DeferredPostprocessLayout {
    // Uniforms
    DiffuseMap: WebGLUniformLocation;
    SpecularMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
