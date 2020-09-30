import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Light,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Light = 1 << Component.Light,
    Transform = 1 << Component.Transform,
}

export interface World {
    // Component flags
    Signature: Array<number>;

    // Component data
    Camera: Array<Camera>;
    Light: Array<Light>;
    Transform: Array<Transform>;
}
