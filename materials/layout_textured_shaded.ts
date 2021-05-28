export interface TexturedShadedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    Eye: WebGLUniformLocation;
    ColorDiffuse: WebGLUniformLocation;
    ColorSpecular: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
    Sampler: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
    VertexNormal: GLint;
}
