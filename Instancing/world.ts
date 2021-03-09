import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Children,
    Light,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
