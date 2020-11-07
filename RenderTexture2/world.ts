import {Camera} from "./components/com_camera.js";
import {ControlMove} from "./components/com_control_move.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render2.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    ControlMove,
    Move,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    ControlMove = 1 << Component.ControlMove,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    ControlMove: Array<ControlMove> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
