export interface MappedShadedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;

    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    RoughnessMap: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
    VertexNormal: GLint;
    VertexTangent: GLint;
    VertexBitangent: GLint;
}
