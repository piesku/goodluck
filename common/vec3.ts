import {Mat4, Vec3} from "./math.js";

export function set(out: Vec3, x: number, y: number, z: number) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}

export function copy(out: Vec3, a: Vec3) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}

export function add(out: Vec3, a: Vec3, b: Vec3) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
}

export function subtract(out: Vec3, a: Vec3, b: Vec3) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}

export function scale(out: Vec3, a: Vec3, b: number) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
}

export function negate(out: Vec3, a: Vec3) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
}

export function normalize(out: Vec3, a: Vec3) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let len = x * x + y * y + z * z;

    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}

export function dot(a: Vec3, b: Vec3) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(out: Vec3, a: Vec3, b: Vec3) {
    let ax = a[0],
        ay = a[1],
        az = a[2];
    let bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}

export function transform_position(out: Vec3, a: Vec3, m: Mat4) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;

    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
}

export function transform_direction(out: Vec3, a: Vec3, m: Mat4) {
    let x = a[0];
    let y = a[1];
    let z = a[2];

    out[0] = m[0] * x + m[4] * y + m[8] * z;
    out[1] = m[1] * x + m[5] * y + m[9] * z;
    out[2] = m[2] * x + m[6] * y + m[10] * z;
    return out;
}

export function length(a: Vec3) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return Math.hypot(x, y, z);
}

export function distance(a: Vec3, b: Vec3) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return Math.hypot(x, y, z);
}

export function distance_squared(a: Vec3, b: Vec3) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return x * x + y * y + z * z;
}

export function manhattan(a: Vec3, b: Vec3) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

export function lerp(out: Vec3, a: Vec3, b: Vec3, t: number) {
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
}
