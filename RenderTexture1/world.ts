import {Camera} from "./components/com_camera.js";
import {Render} from "./components/com_render.js";
import {Rotate} from "./components/com_rotate.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Render,
    Rotate,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    Render: Array<Render> = [];
    Rotate: Array<Rotate> = [];
    Transform: Array<Transform> = [];
}
