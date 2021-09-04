export interface ColoredUnlitLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;

    Color: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
}

export interface ColoredShadedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;

    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
}

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

export interface TexturedShadedLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    Self: WebGLUniformLocation;

    DiffuseMap: WebGLUniformLocation;
    DiffuseColor: WebGLUniformLocation;
    SpecularColor: WebGLUniformLocation;
    Shininess: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexCoord: GLint;
    VertexNormal: GLint;
}

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

export interface ForwardShadingLayout {
    // Uniforms
    Eye: WebGLUniformLocation;
    LightPositions: WebGLUniformLocation;
    LightDetails: WebGLUniformLocation;
}

export interface ShadowMappingLayout {
    // Uniforms
    ShadowSpace: WebGLUniformLocation;
    ShadowMap: WebGLUniformLocation;
}

export interface DepthMappingLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
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
    VertexTexcoord: GLint;
}

export interface PostprocessLayout {
    // Uniforms
    Sampler: WebGLUniformLocation;
    ViewportSize: WebGLUniformLocation;

    // Attributes
    VertexPosition: GLint;
    VertexTexcoord: GLint;
}
