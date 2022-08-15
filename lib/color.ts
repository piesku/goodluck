import {Vec3, Vec4} from "./math.js";

export function vec4_to_hex(color: Vec4) {
    let r = (color[0] * 255).toString(16).padStart(2, "0");
    let g = (color[1] * 255).toString(16).padStart(2, "0");
    let b = (color[2] * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

export function hex_to_vec4(color: string): Vec4 {
    return [
        parseInt(color.slice(1, 3), 16) / 255,
        parseInt(color.slice(3, 5), 16) / 255,
        parseInt(color.slice(5, 7), 16) / 255,
        1,
    ];
}

function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula adapted from
 * http://en.wikipedia.org/wiki/HSL_color_space.  Assumes hsla components are
 * contained in the set [0, 1] and returns rgba in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 */
export function hsla_to_vec4(h: number, s: number, l: number, a: number): Vec4 {
    let r: number;
    let g: number;
    let b: number;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b, a];
}

/**
 * Converts an HSV color value to RGB. Conversion formula adapted from
 * http://en.wikipedia.org/wiki/HSV_color_space.  Assumes hsva components are
 * contained in the set [0, 1] and returns rgba in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 */
export function hsva_to_vec4(h: number, s: number, v: number, a: number): Vec4 {
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            return [v, t, p, a];
        case 1:
            return [q, v, p, a];
        case 2:
            return [p, v, t, a];
        case 3:
            return [p, q, v, a];
        case 4:
            return [t, p, v, a];
        // case 5
        default:
            return [v, p, q, a];
    }
}

/**
 * Expand (decode) an sRGB color to linear color space, similar to how the
 * monitor does it when displaying pixels to the user.
 * @param color The sRGB color to expand to linear color space.
 */
export function gamma_decode(color: Vec3): Vec3 {
    let gamma = 2.2;
    return [color[0] ** gamma, color[1] ** gamma, color[2] ** gamma];
}

/**
 * Compress (encode) a linear RGB color to sRGB. Usually this is done after
 * lighting computations and just before sending the color to the canvas, to
 * compensate for the loss in brightness caused by the monitor.
 * @param color The linear color to compress to sRGB.
 */
export function gamma_encode(color: Vec3): Vec3 {
    let gamma = 1 / 2.2;
    return [color[0] ** gamma, color[1] ** gamma, color[2] ** gamma];
}
