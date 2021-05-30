export interface ColoredShadedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;

    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;

    Eye: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}
