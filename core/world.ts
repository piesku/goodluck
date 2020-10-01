import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Rotate} from "./components/com_rotate.js";
import {Transform} from "./components/com_transform.js";
import {Transform2D} from "./components/com_transform2d.js";

const enum Component {
    Animate,
    AudioSource,
    Camera,
    Draw,
    Light,
    Move,
    Render,
    Rotate,
    Transform,
    Transform2D,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Rotate = 1 << Component.Rotate,
    Transform = 1 << Component.Transform,
    Transform2D = 1 << Component.Transform2D,
}

export interface World {
    // Component flags
    Signature: Array<number>;

    // Component data
    Animate: Array<Animate>;
    AudioSource: Array<AudioSource>;
    Draw: Array<Draw>;
    Camera: Array<Camera>;
    Light: Array<Light>;
    Move: Array<Move>;
    // Render depends on the version of WebGL. See com_render*, sys_render*.
    Rotate: Array<Rotate>;
    Transform: Array<Transform>;
    Transform2D: Array<Transform2D>;
}
