export interface InstancedColumnLayout {
    InstanceColumn1: GLint;
    InstanceColumn2: GLint;
    InstanceColumn3: GLint;
    InstanceColumn4: GLint;
}

export interface InstancedColorLayout {
    InstanceColor: GLint;
}

export interface FogLayout {
    Eye: WebGLUniformLocation;
    FogColor: WebGLUniformLocation;
    FogDistance: WebGLUniformLocation;
}
