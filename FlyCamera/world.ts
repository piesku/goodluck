import {Move} from "../src/components/com_move.js";
import {PlayerControl} from "../src/components/com_player_control.js";
import {Camera} from "./components/com_camera.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    ControlPlayer: Array<PlayerControl> = [];
    Draw: Array<Draw> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
