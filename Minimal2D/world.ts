import {WorldImpl} from "../common/world.js";
import {Children} from "./components/com_children.js";
import {Draw} from "./components/com_draw.js";
import {Transform2D} from "./components/com_transform2d.js";

const enum Component {
    Children,
    Dirty,
    Draw,
    Transform2D,
}

export const enum Has {
    None = 0,
    Children = 1 << Component.Children,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    Transform2D = 1 << Component.Transform2D,
}

export class World extends WorldImpl {
    Children: Array<Children> = [];
    Draw: Array<Draw> = [];
    Transform2D: Array<Transform2D> = [];
}
