import {WorldImpl} from "../common/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Render2D} from "./components/com_render2d.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Children,
    Dirty,
    Render2D,
    Transform,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Dirty = 1 << Component.Dirty,
    Render2D = 1 << Component.Render2D,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Render2D: Array<Render2D> = [];
    Transform: Array<Transform> = [];
}
