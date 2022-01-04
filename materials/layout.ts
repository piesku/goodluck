/**
 * The following attribute locations are shared by all material layouts.
 */
export const enum Attribute {
    Position,
    Normal,
    TexCoord,
    Tangent,
    Bitangent,
    Weights,
}

export const enum Output {
    Diffuse,
    Specular,
    Position,
    Normal,
    Depth,
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
    EmissiveColor: WebGLUniformLocation;
}

export interface ColoredDeferredLayout extends WorldSpaceLayout {
    Self: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
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
    EmissiveColor: WebGLUniformLocation;
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

    DiffuseMap: WebGLUniformLocation;
    SpecularMap: WebGLUniformLocation;
    EmissiveMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;
}

export interface ShadowMappingLayout {
    ShadowSpace: WebGLUniformLocation;
    ShadowMap: WebGLUniformLocation;
}

export interface PostprocessLayout {
    Viewport: WebGLUniformLocation;
    Sampler: WebGLUniformLocation;
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
