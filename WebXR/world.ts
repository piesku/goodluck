import {Camera} from "./components/com_camera.js";
import {ControlXr} from "./components/com_control_xr.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    ControlXr,
    Light,
    Pose,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    ControlXr = 1 << Component.ControlXr,
    Light = 1 << Component.Light,
    Pose = 1 << Component.Pose,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    ControlXr: Array<ControlXr> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
