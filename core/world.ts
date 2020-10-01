import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Draw} from "./components/com_draw.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Animate,
    AudioSource,
    Camera,
    Draw,
    Light,
    Move,
    Render,
    Transform,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Draw = 1 << Component.Draw,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
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
    Render: Array<Render>;
    Transform: Array<Transform>;
}
