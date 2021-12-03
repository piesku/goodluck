export interface Instanced2DLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    SpriteSheet: WebGLUniformLocation;

    // Vertex attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;

    // Instance attributes
    InstanceRotation: GLint;
    InstanceTranslation: GLint;
    InstanceColor: GLint;
}
