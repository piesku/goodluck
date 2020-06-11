import {Draw} from "./components/com_draw.js";
import {Transform2D} from "./components/com_transform2d.js";

const enum Component {
    Draw,
    Transform2D,
}

export const enum Has {
    Draw = 1 << Component.Draw,
    Transform2D = 1 << Component.Transform2D,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Draw: Array<Draw> = [];
    Transform2D: Array<Transform2D> = [];
}
