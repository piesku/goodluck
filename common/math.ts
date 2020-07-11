export const EPSILON = 0.000001;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export type Rad = number;
export type Quat = [number, number, number, number];
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Mat2D = [number, number, number, number, number, number];
export type Mat3 = [number, number, number, number, number, number, number, number, number];
export type Mat4 =
    | Float32Array
    | [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number
      ];
