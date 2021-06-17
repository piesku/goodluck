export interface ParticlesColoredLayout {
    // Uniforms
    Pv: WebGLUniformLocation;

    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;

    // Attributes
    OriginAge: GLint;
    Direction: GLint;
}

export interface ParticlesTexturedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;

    TextureMap: WebGLUniformLocation;
    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;

    // Attributes
    OriginAge: GLint;
    DirectionSeed: GLint;
}
