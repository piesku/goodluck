export interface SpecularLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    Eye: WebGLUniformLocation;
    ColorDiffuse: WebGLUniformLocation;
    ColorSpecular: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}
