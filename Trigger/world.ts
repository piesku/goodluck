import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Rotate} from "./components/com_rotate.js";
import {Transform} from "./components/com_transform.js";
import {Trigger} from "./components/com_trigger.js";

const enum Component {
    Camera,
    Collide,
    Light,
    Render,
    Rotate,
    Transform,
    Trigger,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
    Trigger = 1 << Component.Trigger,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    Collide: Array<Collide> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Rotate: Array<Rotate> = [];
    Transform: Array<Transform> = [];
    Trigger: Array<Trigger> = [];
}
