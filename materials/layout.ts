export interface ClipSpaceLayout {
    Pv: WebGLUniformLocation;
    VertexPosition: GLint;
}

export interface WorldSpaceLayout extends ClipSpaceLayout {
    World: WebGLUniformLocation;
}

export interface ColoredUnlitLayout extends WorldSpaceLayout {
    Color: WebGLUniformLocation;
}

export interface CorrectNormalsLayout {
    Self: WebGLUniformLocation;
    VertexNormal: GLint;
}

export interface ColoredShadedLayout extends WorldSpaceLayout, CorrectNormalsLayout {
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
}

export interface TexturedUnlitLayout extends WorldSpaceLayout {
    TextureMap: WebGLUniformLocation;
    Color: WebGLUniformLocation;
    VertexTexCoord: GLint;
}

export interface TexturedShadedLayout extends WorldSpaceLayout, CorrectNormalsLayout {
    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;
    VertexTexCoord: GLint;
}

export interface MappedShadedLayout extends WorldSpaceLayout, CorrectNormalsLayout {
    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    RoughnessMap: WebGLUniformLocation;
    VertexTexCoord: GLint;
    VertexTangent: GLint;
    VertexBitangent: GLint;
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
    // Uniforms
    ShadowSpace: WebGLUniformLocation;
    ShadowMap: WebGLUniformLocation;
}

export interface DeferredPostprocessLayout {
    // Uniforms
    DiffuseMap: WebGLUniformLocation;
    SpecularMap: WebGLUniformLocation;
    PositionMap: WebGLUniformLocation;
    NormalMap: WebGLUniformLocation;
    DepthMap: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
}

export interface PostprocessLayout {
    // Uniforms
    Sampler: WebGLUniformLocation;
    ViewportSize: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}

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
