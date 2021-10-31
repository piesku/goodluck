import {Mat2D, Rad, Vec2} from "./math.js";

export function create(): Mat2D {
    return [1, 0, 0, 1, 0, 0];
}

export function set(
    out: Mat2D,
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
}

export function invert(out: Mat2D, a: Mat2D) {
    let aa = a[0],
        ab = a[1],
        ac = a[2],
        ad = a[3];
    let atx = a[4],
        aty = a[5];

    let det = aa * ad - ab * ac;
    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
}

export function multiply(out: Mat2D, a: Mat2D, b: Mat2D) {
    let a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3],
        b4 = b[4],
        b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
}

export function from_rotation(out: Mat2D, rad: Rad) {
    let s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

export function from_scaling(out: Mat2D, v: Vec2) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

export function from_translation(out: Mat2D, v: Vec2) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

export function compose(out: Mat2D, v: Vec2, r: Rad, s: Vec2) {
    let sin = Math.sin(r);
    let cos = Math.cos(r);
    out[0] = cos * s[0];
    out[1] = sin * s[0];
    out[2] = -sin * s[1];
    out[3] = cos * s[1];
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

export function rotate(out: Mat2D, a: Mat2D, rad: Rad) {
    let a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    out[0] = a0 * c + a2 * s;
    out[1] = a1 * c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
}

export function scale(out: Mat2D, a: Mat2D, v: Vec2) {
    let a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    let v0 = v[0],
        v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
}

export function translate(out: Mat2D, a: Mat2D, v: Vec2) {
    let a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    let v0 = v[0],
        v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
}

export function get_scaling(out: Vec2, a: Mat2D) {
    out[0] = Math.hypot(a[0], a[1]);
    out[1] = Math.hypot(a[2], a[3]);
    return out;
}

export function get_translation(out: Vec2, a: Mat2D) {
    out[0] = a[4];
    out[1] = a[5];
    return out;
}

export function transform_point(out: Vec2, a: Vec2, m: Mat2D) {
    let x = a[0];
    let y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}
