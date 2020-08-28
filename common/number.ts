export function lerp(from: number, to: number, progress: number) {
    return from + progress * (to - from);
}

export function clamp(min: number, max: number, num: number) {
    return Math.max(min, Math.min(max, num));
}

export function map_range(
    value: number,
    old_min: number,
    old_max: number,
    new_min: number,
    new_max: number
) {
    return ((value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min;
}
