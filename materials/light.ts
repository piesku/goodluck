// The default forward rendering pipeline supports 8 lights.
export const MAX_FORWARD_LIGHTS = 8;

export const enum LightKind {
    Inactive,
    Ambient,
    Directional,
    Point,
}

export const INCLUDE_GAMMA_CORRECTION = `
    // Expand (decode) an sRGB color to linear color space, similar to how the
    // monitor does it when displaying pixels to the user.

    // Convert ~sRGB to linear.
    vec3 GAMMA_DECODE(vec3 rgb) {
        return pow(rgb, vec3(2.2));
    }

    // Convert ~sRGBA to linear.
    vec4 GAMMA_DECODE(vec4 color) {
        return vec4(pow(color.rgb, vec3(2.2)), color.a);
    }

    // Compress (encode) a linear RGB color to sRGB. Usually this is done after
    // lighting computations and just before sending the color to the canvas, to
    // compensate for the loss in brightness caused by the monitor.

    // Convert linear to ~sRGB.
    vec3 GAMMA_ENCODE(vec3 rgb) {
        return pow(rgb, vec3(1.0 / 2.2));
    }

    // Convert linear to ~sRGBA.
    vec4 GAMMA_ENCODE(vec4 color) {
        return vec4(pow(color.rgb, vec3(1.0 / 2.2)), color.a);
    }
`;
