export interface Instanced2DLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;

    // Vertex attributes
    VertexPosition: GLint;
    VertexNormal: GLint;
    VertexTexcoord: GLint;

    // Instance attributes
    InstanceColumn1: GLint;
    InstanceColumn2: GLint;
    InstanceColumn3: GLint;
    InstanceColumn4: GLint;
    InstanceColor: GLint;
}
