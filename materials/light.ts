// The default forward rendering pipeline supports 8 lights.
export const MAX_FORWARD_LIGHTS = 8;

export const enum LightKind {
    Inactive,
    Ambient,
    Directional,
    Point,
}
