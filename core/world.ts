import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {Draw} from "./components/com_draw.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Rotate} from "./components/com_rotate.js";
import {Shake} from "./components/com_shake.js";
import {Transform} from "./components/com_transform.js";
import {Transform2D} from "./components/com_transform2d.js";

const enum Component {
    Animate,
    AudioSource,
    Camera,
    Collide,
    Draw,
    Lifespan,
    Light,
    Mimic,
    Move,
    Named,
    Render,
    RigidBody,
    Rotate,
    Shake,
    Transform,
    Transform2D,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    Draw = 1 << Component.Draw,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Mimic = 1 << Component.Mimic,
    Move = 1 << Component.Move,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Rotate = 1 << Component.Rotate,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
    Transform2D = 1 << Component.Transform2D,
}

export interface World {
    // Component flags
    Signature: Array<number>;

    // Component data
    Animate: Array<Animate>;
    AudioSource: Array<AudioSource>;
    Camera: Array<Camera>;
    Collide: Array<Collide>;
    Draw: Array<Draw>;
    Lifespan: Array<Lifespan>;
    Light: Array<Light>;
    Mimic: Array<Mimic>;
    Move: Array<Move>;
    Named: Array<Named>;
    // Render depends on the version of WebGL. See com_render*, sys_render*.
    RigidBody: Array<RigidBody>;
    Rotate: Array<Rotate>;
    Shake: Array<Shake>;
    Transform: Array<Transform>;
    Transform2D: Array<Transform2D>;
}
