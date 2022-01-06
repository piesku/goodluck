// The default forward rendering pipeline supports 8 lights.
export const MAX_FORWARD_LIGHTS = 8;

export const enum LightKind {
    Inactive,
    Ambient,
    Directional,
    Point,
}

// Expand (decode) an sRGB color to linear color space, similar to how the
// monitor does it when displaying pixels to the user.
export const INCLUDE_GAMMA_EXPAND = `
    // Convert ~sRGB to linear.
    vec3 GAMMA_EXPAND(vec3 rgb) {
        return pow(rgb, vec3(2.2));
    }
`;

// Compress (encode) a linear RGB color to sRGB. Usually this is done after
// lighting computations and just before sending the color to the canvas, to
// compensate for the loss in brightness caused by the monitor.
export const INCLUDE_GAMMA_COMPRESS = `
    // Convert linear to ~sRGB.
    vec3 GAMMA_COMPRESS(vec3 rgb) {
        return pow(rgb, vec3(1.0 / 2.2));
    }
`;
