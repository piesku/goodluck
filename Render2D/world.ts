import {WorldImpl} from "../lib/world.js";
import {Camera2D} from "./components/com_camera2d.js";
import {Children} from "./components/com_children.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {LocalTransform2D} from "./components/com_local_transform2d.js";
import {Render2D} from "./components/com_render2d.js";
import {RigidBody2D} from "./components/com_rigid_body2d.js";
import {SpatialNode2D} from "./components/com_spatial_node2d.js";

const enum Component {
    Camera2D,
    ControlPlayer,
    Children,
    Dirty,
    Draw,
    LocalTransform2D,
    Render2D,
    RigidBody2D,
    SpatialNode2D,
}

export const enum Has {
    None = 0,
    Camera2D = 1 << Component.Camera2D,
    ControlPlayer = 1 << Component.ControlPlayer,
    Children = 1 << Component.Children,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    LocalTransform2D = 1 << Component.LocalTransform2D,
    Render2D = 1 << Component.Render2D,
    RigidBody2D = 1 << Component.RigidBody2D,
    SpatialNode2D = 1 << Component.SpatialNode2D,
}

export class World extends WorldImpl {
    Camera2D: Array<Camera2D> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    Children: Array<Children> = [];
    Draw: Array<Draw> = [];
    LocalTransform2D: Array<LocalTransform2D> = [];
    Render2D: Array<Render2D> = [];
    RigidBody2D: Array<RigidBody2D> = [];
    SpatialNode2D: Array<SpatialNode2D> = [];
}
