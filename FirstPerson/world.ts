import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render1.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Children,
    ControlPlayer,
    Draw,
    Light,
    Move,
    Render,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    ControlPlayer = 1 << Component.ControlPlayer,
    Draw = 1 << Component.Draw,
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
    ControlPlayer: Array<ControlPlayer> = [];
    Draw: Array<Draw> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
