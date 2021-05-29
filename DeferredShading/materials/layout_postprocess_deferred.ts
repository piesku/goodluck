export interface PostprocessDeferredLayout {
    // Uniforms
    DiffuseMap: WebGLUniformLocation;
    SpecularMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;

    Eye: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
