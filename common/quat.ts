import {DEG_TO_RAD, EPSILON, Quat, RAD_TO_DEG, Vec3} from "./math.js";
import {clamp} from "./number.js";
import {cross, dot, length, normalize as normalize_vec3} from "./vec3.js";

export function set(out: Quat, x: number, y: number, z: number, w: number) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}

export function copy(out: Quat, a: Quat) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
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

export function conjugate(out: Quat, a: Quat) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
}

/**
 * Compute a quaternion out of three Euler angles given in degrees. The order of rotation is YXZ.
 * @param out Quaternion to write to.
 * @param x Rotation about the X axis, in degrees.
 * @param y Rotation around the Y axis, in degress.
 * @param z Rotation around the Z axis, in degress.
 */
export function from_euler(out: Quat, x: number, y: number, z: number) {
    let sx = Math.sin((x / 2) * DEG_TO_RAD);
    let cx = Math.cos((x / 2) * DEG_TO_RAD);
    let sy = Math.sin((y / 2) * DEG_TO_RAD);
    let cy = Math.cos((y / 2) * DEG_TO_RAD);
    let sz = Math.sin((z / 2) * DEG_TO_RAD);
    let cz = Math.cos((z / 2) * DEG_TO_RAD);

    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
}

/**
 * Convert a quaternion into three Euler angles, in YXZ order, expressed in arc degrees.
 * @param euler Vector of Euler angles to write into.
 * @param quat Quaternion to decompose.
 */
export function to_euler(euler: Vec3, quat: Quat) {
    let x = quat[0];
    let y = quat[1];
    let z = quat[2];
    let w = quat[3];

    let m11 = 1 - 2 * (y * y + z * z);
    let m21 = 2 * (x * y + w * z);
    let m31 = 2 * (x * z - w * y);

    let m22 = 1 - 2 * (x * x + z * z);

    let m13 = 2 * (x * z + w * y);
    let m23 = 2 * (y * z - w * x);
    let m33 = 1 - 2 * (x * x + y * y);

    euler[0] = Math.asin(-clamp(-1, 1, m23)) * RAD_TO_DEG;
    if (Math.abs(m23) + EPSILON < 1) {
        euler[1] = Math.atan2(m13, m33) * RAD_TO_DEG;
        euler[2] = Math.atan2(m21, m22) * RAD_TO_DEG;
    } else {
        euler[1] = Math.atan2(-m31, m11) * RAD_TO_DEG;
        euler[2] = 0;
    }

    return euler;
}

/**
 * Get the pitch (rotation around the X axis) of a quaternion, in arc degrees.
 * @param quat Quaternion to decompose.
 */
export function get_pitch(quat: Quat) {
    let x = quat[0];
    let y = quat[1];
    let z = quat[2];
    let w = quat[3];

    let m23 = 2 * (y * z - w * x);
    return Math.asin(-clamp(-1, 1, m23)) * RAD_TO_DEG;
}

/**
 * Get the yaw (rotation around the Y axis) of a quaternion, in arc degrees.
 * @param quat Quaternion to decompose.
 */
export function get_yaw(quat: Quat) {
    let x = quat[0];
    let y = quat[1];
    let z = quat[2];
    let w = quat[3];

    let a = 2 * (w * y + x * z);
    let b = 1 - 2 * (x * x + y * y);
    return Math.atan2(a, b) * RAD_TO_DEG;
}

/**
 * Compute a quaternion from an axis and an angle of rotation around the axis.
 * @param out Quaternion to write to.
 * @param axis Axis of rotation.
 * @param angle Rotation in radians.
 */
export function from_axis(out: Quat, axis: Vec3, angle: number) {
    let half = angle / 2;
    out[0] = Math.sin(half) * axis[0];
    out[1] = Math.sin(half) * axis[1];
    out[2] = Math.sin(half) * axis[2];
    out[3] = Math.cos(half);
    return out;
}

export const rotation_to = (function () {
    let tmpvec3 = <Vec3>[0, 0, 0];
    let xUnitVec3 = <Vec3>[1, 0, 0];
    let yUnitVec3 = <Vec3>[0, 1, 0];

    return function (out: Quat, a: Vec3, b: Vec3) {
        let d = dot(a, b);
        if (d < -0.999999) {
            cross(tmpvec3, xUnitVec3, a);
            if (length(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
            normalize_vec3(tmpvec3, tmpvec3);
            from_axis(out, tmpvec3, Math.PI);
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

export function get_axis(out_axis: Vec3, q: Quat) {
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
