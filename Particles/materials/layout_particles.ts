export interface ParticlesLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;
    // Attributes
    OriginAge: GLint;
    Direction: GLint;
}
