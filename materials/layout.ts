/**
 * The following attribute locations are shared by all material layouts.
 */
export const enum Attribute {
    Position = 0,
    Normal = 1,
    TexCoord = 2,
    Tangent = 3,
    Bitangent = 4,
    Weights = 5,
}

export const enum Output {
    Diffuse = 0,
    Specular = 1,
    Position = 2,
    Normal = 3,
    Depth = 4,
}

export interface WorldSpaceLayout {
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
}

export interface ColoredUnlitLayout extends WorldSpaceLayout {
    Color: WebGLUniformLocation;
}

export interface ColoredShadedLayout extends WorldSpaceLayout {
    Self: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
}

export interface ColoredEmissiveLayout extends ColoredShadedLayout {
    Emission: WebGLUniformLocation;
}

export interface TexturedUnlitLayout extends WorldSpaceLayout {
    TextureMap: WebGLUniformLocation;
    Color: WebGLUniformLocation;
}

export interface TexturedShadedLayout extends WorldSpaceLayout {
    Self: WebGLUniformLocation;
    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
}

export interface MappedShadedLayout extends WorldSpaceLayout {
    Self: WebGLUniformLocation;
    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    RoughnessMap: WebGLUniformLocation;
}

export interface ForwardShadingLayout {
    Eye: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
}

export interface DeferredShadingLayout {
    Eye: WebGLUniformLocation;
    LightKind: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
}

export interface ShadowMappingLayout {
    ShadowSpace: WebGLUniformLocation;
    ShadowMap: WebGLUniformLocation;
}

export interface DeferredPostprocessLayout {
    DiffuseMap: WebGLUniformLocation;
    SpecularMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;
}

export interface PostprocessLayout {
    Sampler: WebGLUniformLocation;
    ViewportSize: WebGLUniformLocation;
}

export interface ParticlesColoredLayout {
    Pv: WebGLUniformLocation;
    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;

    // Attributes
    OriginAge: GLint;
    Direction: GLint;
}

export interface ParticlesTexturedLayout {
    Pv: WebGLUniformLocation;
    TextureMap: WebGLUniformLocation;
    ColorStart: WebGLUniformLocation;
    ColorEnd: WebGLUniformLocation;
    Details: WebGLUniformLocation;

    // Attributes
    OriginAge: GLint;
    DirectionSeed: GLint;
}
