import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render1.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
