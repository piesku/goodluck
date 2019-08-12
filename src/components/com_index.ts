import {Camera} from "./com_camera";
import {Light} from "./com_light";
import {Render} from "./com_render";
import {Rotate} from "./com_rotate";
import {Transform} from "./com_transform";

export const enum Get {
    Transform = 1,
    Render = 2,
    Camera = 4,
    Light = 8,
    Rotate = 16,
}

export interface ComponentData {
    [index: number]: Array<unknown>;
    [Get.Transform]: Array<Transform>;
    [Get.Render]: Array<Render>;
    [Get.Camera]: Array<Camera>;
    [Get.Light]: Array<Light>;
    [Get.Rotate]: Array<Rotate>;
}
