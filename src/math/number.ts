export function lerp(from: number, to: number, progress: number) {
    return from + progress * (to - from);
}
