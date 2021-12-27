import {WorldImpl} from "../common/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {ControlAlways2D} from "./components/com_control_always2d.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Move2D} from "./components/com_move2d.js";
import {Render2D} from "./components/com_render2d.js";
import {RigidBody2D} from "./components/com_rigid_body2d.js";
import {Transform2D} from "./components/com_transform2d.js";

const enum Component {
    Camera,
    ControlAlways2D,
    ControlPlayer,
    Children,
    Dirty,
    Move2D,
    Render2D,
    RigidBody2D,
    Transform2D,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    ControlAlways2D = 1 << Component.ControlAlways2D,
    ControlPlayer = 1 << Component.ControlPlayer,
    Children = 1 << Component.Children,
    Dirty = 1 << Component.Dirty,
    Move2D = 1 << Component.Move2D,
    Render2D = 1 << Component.Render2D,
    RigidBody2D = 1 << Component.RigidBody2D,
    Transform2D = 1 << Component.Transform2D,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    ControlAlways2D: Array<ControlAlways2D> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    Children: Array<Children> = [];
    Move2D: Array<Move2D> = [];
    Render2D: Array<Render2D> = [];
    RigidBody2D: Array<RigidBody2D> = [];
    Transform2D: Array<Transform2D> = [];
}
