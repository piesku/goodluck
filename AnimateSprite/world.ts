import {WorldImpl} from "../lib/world.js";
import {AnimateSprite} from "./components/com_animate_sprite.js";
import {Camera2D} from "./components/com_camera2d.js";
import {Children} from "./components/com_children.js";
import {Draw} from "./components/com_draw.js";
import {LocalTransform2D} from "./components/com_local_transform2d.js";
import {Render2D} from "./components/com_render2d.js";
import {SpatialNode2D} from "./components/com_spatial_node2d.js";

const enum Component {
    AnimateSprite,
    Camera2D,
    Children,
    Dirty,
    Draw,
    LocalTransform2D,
    Render2D,
    SpatialNode2D,
}

export const enum Has {
    None = 0,
    AnimateSprite = 1 << Component.AnimateSprite,
    Camera2D = 1 << Component.Camera2D,
    Children = 1 << Component.Children,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    LocalTransform2D = 1 << Component.LocalTransform2D,
    Render2D = 1 << Component.Render2D,
    SpatialNode2D = 1 << Component.SpatialNode2D,
}

export class World extends WorldImpl {
    AnimateSprite: Array<AnimateSprite> = [];
    Camera2D: Array<Camera2D> = [];
    Children: Array<Children> = [];
    Draw: Array<Draw> = [];
    LocalTransform2D: Array<LocalTransform2D> = [];
    Render2D: Array<Render2D> = [];
    SpatialNode2D: Array<SpatialNode2D> = [];
}
