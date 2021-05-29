export interface TexturedUnlitLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;

    TextureMap: WebGLUniformLocation;
    Color: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
}
