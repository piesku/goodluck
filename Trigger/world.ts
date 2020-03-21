import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Rotate} from "./components/com_rotate.js";
import {Transform} from "./components/com_transform.js";

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
}
