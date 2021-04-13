export interface DeferredPostprocessLayout {
    // Uniforms
    DiffuseMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
