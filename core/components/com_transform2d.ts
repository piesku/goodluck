/**
 * @module components/com_transform2d
 */

import {Deg, Mat2D, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";

export interface Transform2D {
    /** Absolute matrix relative to the world. */
    World: Mat2D;
    /** World to self matrix. */
    Self: Mat2D;
    /** Local translation relative to the parent. */
    Translation: Vec2;
    /** Local rotation relative to the parent. */
    Rotation: Deg;
    /** Local scale relative to the parent. */
    Scale: Vec2;
    Parent?: Entity;
    /** Ignore parent's rotation and scale? */
    Gyroscope: boolean;
}
