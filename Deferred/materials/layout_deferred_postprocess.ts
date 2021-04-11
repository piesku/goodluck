export interface DeferredPostprocessLayout {
    // Uniforms
    Dimensions: WebGLUniformLocation;
    EyeWorld: WebGLUniformLocation;
    EyeUnprojection: WebGLUniformLocation;
    ColorMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightColors: WebGLUniformLocation;
    LightDirections: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
