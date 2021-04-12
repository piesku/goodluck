export interface DeferredPostprocessLayout {
    // Uniforms
    Dimensions: WebGLUniformLocation;
    EyeWorld: WebGLUniformLocation;
    EyeUnprojection: WebGLUniformLocation;
    ColorMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
