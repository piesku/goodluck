export interface ForwardInstancedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;

    Palette: WebGLUniformLocation;

    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;

    VertexOffset: GLint;
}
