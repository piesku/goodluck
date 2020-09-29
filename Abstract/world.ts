import {Transform} from "./components/com_transform.js";

const enum Component {
    Transform,
}

export const enum Has {
    Transform = 1 << Component.Transform,
}

export interface World {
    // Component flags
    Signature: Array<number>;

    // Component data
    Transform: Array<Transform>;
}
