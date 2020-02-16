import {Draw} from "./components/com_draw.js";
import {Transform2D} from "./components/com_transform2d.js";

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Draw: Array<Draw> = [];
    Transform2D: Array<Transform2D> = [];
}
