import {Camera} from "./components/com_camera.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Transform = 1 << Component.Transform,
}

export interface World {
    // Component flags
    Signature: Array<number>;

    // Component data
    Camera: Array<Camera>;
    Transform: Array<Transform>;
}
