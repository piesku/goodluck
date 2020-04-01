import {Camera} from "./components/com_camera.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {NavAgent} from "./components/com_nav_agent.js";
import {Pickable} from "./components/com_pickable.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    Draw: Array<Draw> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    NavAgent: Array<NavAgent> = [];
    Pickable: Array<Pickable> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
