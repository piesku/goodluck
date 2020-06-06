import {CameraDisplay} from "./com_camera_display.js";
import {CameraFramebuffer} from "./com_camera_framebuffer.js";

export type Camera = CameraDisplay | CameraFramebuffer;
export const enum CameraKind {
    Display,
    Framebuffer,
}
