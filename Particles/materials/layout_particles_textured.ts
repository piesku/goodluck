export interface ParticlesTexturedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    Sampler: WebGLUniformLocation;
    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;
    // Attributes
    OriginAge: GLint;
    DirectionSeed: GLint;
}
