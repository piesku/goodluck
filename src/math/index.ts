interface Vector {
    length: number;
    [index: number]: number;
    [Symbol.iterator](): IterableIterator<number>;
    slice(start?: number, end?: number): Vector;
}

export interface Quat extends Vector {}
export interface Vec3 extends Vector {}
export interface Vec4 extends Vector {}
export interface Mat3 extends Vector {}
export interface Mat4 extends Vector {}

export const EPSILON = 0.000001;
