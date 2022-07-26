export const enum Attribute {
    VertexPosition,
    VertexTexCoord,
    InstanceRotation,
    InstanceTranslation,
    InstanceColor,
    InstanceSprite,
}

export interface Instanced2DLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    SheetTexture: WebGLUniformLocation;
    SheetSize: WebGLUniformLocation;
}
