import {EPSILON, Quat, Vec3} from "./index.js";
import {cross, dot, length, normalize as normalize_vec3} from "./vec3.js";

export function set_axis_angle(out: Quat, axis: Vec3, rad: number) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
}

export function normalize(out: Quat, a: Quat) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = a[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
}

export function multiply(out: Quat, a: Quat, b: Quat) {
    let ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    let bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
}

export function from_euler(out: Quat, x: number, y: number, z: number) {
    let halfToRad = (0.5 * Math.PI) / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

export function from_axis(out: Quat, axis: Vec3, angle: number) {
    let half = angle / 2;
    out[0] = Math.sin(half) * axis[0];
    out[1] = Math.sin(half) * axis[1];
    out[2] = Math.sin(half) * axis[2];
    out[3] = Math.cos(half);
    return out;
}

export const rotation_to = (function() {
    let tmpvec3 = <Vec3>[0, 0, 0];
    let xUnitVec3 = <Vec3>[1, 0, 0];
    let yUnitVec3 = <Vec3>[0, 1, 0];

    return function(out: Quat, a: Vec3, b: Vec3) {
        let d = dot(a, b);
        if (d < -0.999999) {
            cross(tmpvec3, xUnitVec3, a);
            if (length(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
            normalize_vec3(tmpvec3, tmpvec3);
            set_axis_angle(out, tmpvec3, Math.PI);
            return out;
        } else if (d > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + d;
            return normalize(out, out);
        }
    };
})();

export function lerp(out: Quat, a: Quat, b: Quat, t: number) {
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    let aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param out - the receiving quaternion
 * @param a - the first operand
 * @param b - the second operand
 * @param t - interpolation amount, in the range [0-1], between the two inputs
 */
export function slerp(out: Quat, a: Quat, b: Quat, t: number) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    let ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    let bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];

    let omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > EPSILON) {
        // standard case (slerp)
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;

    return out;
}

export function get_axis_angle(out_axis: Vec3, q: Quat) {
    let rad = Math.acos(q[3]) * 2.0;
    let s = Math.sin(rad / 2.0);
    if (s > EPSILON) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
    } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
    }
    return rad;
}
