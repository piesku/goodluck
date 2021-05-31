import {Vec2} from "./math";

export function distance(a: Vec2, b: Vec2) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    return Math.hypot(x, y);
}

export function distance_squared(a: Vec2, b: Vec2) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    return x * x + y * y;
}

export function manhattan(a: Vec2, b: Vec2) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
