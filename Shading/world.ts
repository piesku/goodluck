import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {ControlMove} from "./components/com_control_move.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render1.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Children,
    ControlMove,
    Light,
    Move,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    ControlMove = 1 << Component.ControlMove,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    ControlMove: Array<ControlMove> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
