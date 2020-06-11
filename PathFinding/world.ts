import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {NavAgent} from "./components/com_nav_agent.js";
import {Pickable} from "./components/com_pickable.js";
import {Render} from "./components/com_render.js";
import {Selectable} from "./components/com_selectable.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Collide,
    ControlPlayer,
    Draw,
    Light,
    Move,
    NavAgent,
    Pick,
    Pickable,
    Render,
    Selectable,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlPlayer = 1 << Component.ControlPlayer,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    NavAgent = 1 << Component.NavAgent,
    Pick = 1 << Component.Pick,
    Pickable = 1 << Component.Pickable,
    Render = 1 << Component.Render,
    Selectable = 1 << Component.Selectable,
    Transform = 1 << Component.Transform,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    Collide: Array<Collide> = [];
    Draw: Array<Draw> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    NavAgent: Array<NavAgent> = [];
    Pickable: Array<Pickable> = [];
    Render: Array<Render> = [];
    Selectable: Array<Selectable> = [];
    Transform: Array<Transform> = [];
}
