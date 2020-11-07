import {Camera} from "./components/com_camera.js";
import {ControlPose} from "./components/com_control_pose.js";
import {ControlXr} from "./components/com_control_xr.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render2.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    ControlPose,
    ControlXr,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    ControlPose = 1 << Component.ControlPose,
    ControlXr = 1 << Component.ControlXr,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    ControlPose: Array<ControlPose> = [];
    ControlXr: Array<ControlXr> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
