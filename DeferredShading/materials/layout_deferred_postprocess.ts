export interface DeferredPostprocessLayout {
    // Uniforms
    Dimensions: WebGLUniformLocation;
    EyeWorld: WebGLUniformLocation;
    EyeUnprojection: WebGLUniformLocation;
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
