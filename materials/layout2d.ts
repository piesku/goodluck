export interface Instanced2DLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    SheetTexture: WebGLUniformLocation;
    SheetSize: WebGLUniformLocation;

    // Vertex attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;

    // Instance attributes
    // a, b, c, d
    InstanceRotation: GLint;
    // x, y, order, Has.Render bit
    InstanceTranslation: GLint;
    // r, g, b, a
    InstanceColor: GLint;
    // tile_x, tile_y
    InstanceSprite: GLint;
}
