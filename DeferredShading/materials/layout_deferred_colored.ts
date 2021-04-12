export interface DeferredColoredLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;
    Color: WebGLUniformLocation;
    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}
