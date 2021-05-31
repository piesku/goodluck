import {Vec4} from "./math.js";

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
