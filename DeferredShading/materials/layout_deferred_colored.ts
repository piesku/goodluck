export interface DeferredColoredLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    ColorDiffuse: WebGLUniformLocation;
    ColorSpecular: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}
