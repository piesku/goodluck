import {Camera} from "./components/com_camera.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    Draw: Array<Draw> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
