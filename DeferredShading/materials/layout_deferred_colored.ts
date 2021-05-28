export interface DeferredColoredLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}
