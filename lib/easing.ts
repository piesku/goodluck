export function linear(t: number) {
    return t;
}

export function ease_in_quad(t: number) {
    return t * t;
}

export function ease_out_quad(t: number) {
    return 1 - (1 - t) ** 2;
}

export function ease_in_out_quad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function ease_in_cubic(t: number) {
    return t ** 3;
}

export function ease_out_cubic(t: number) {
    return 1 - (1 - t) ** 3;
}

export function ease_in_out_cubic(t: number) {
    return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

export function ease_in_quart(t: number) {
    return t ** 4;
}

export function ease_out_quart(t: number) {
    return 1 - (1 - t) ** 4;
}

export function ease_in_out_quart(t: number) {
    return t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
}

export function ease_in_quint(t: number) {
    return t ** 5;
}

export function ease_out_quint(t: number) {
    return 1 - (1 - t) ** 5;
}

export function ease_in_out_quint(t: number) {
    return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

export function ease_in_sine(t: number) {
    return 1 - Math.cos((t * Math.PI) / 2);
}

export function ease_out_sine(t: number) {
    return Math.sin((t * Math.PI) / 2);
}

export function ease_in_out_sine(t: number) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function ease_in_circ(t: number) {
    return 1 - Math.sqrt(1 - Math.pow(t, 2));
}

export function ease_out_circ(t: number) {
    return Math.sqrt(1 - Math.pow(t - 1, 2));
}

export function ease_in_out_circ(t: number) {
    return t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
}
