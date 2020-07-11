export function lerp(from: number, to: number, progress: number) {
    return from + progress * (to - from);
}

export function clamp(min: number, max: number, num: number) {
    return Math.max(min, Math.min(max, num));
}
