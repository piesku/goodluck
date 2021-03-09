import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlMove} from "./components/com_control_move.js";
import {Draw} from "./components/com_draw.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Shake} from "./components/com_shake.js";
import {Transform} from "./components/com_transform.js";
import {Transform2D} from "./components/com_transform2d.js";
import {Trigger} from "./components/com_trigger.js";
import {Entity} from "./game.js";

const enum Component {
    Animate,
    AudioListener,
    AudioSource,
    Camera,
    Children,
    Collide,
    ControlMove,
    Draw,
    Lifespan,
    Light,
    Mimic,
    Move,
    Named,
    Render,
    RigidBody,
    Shake,
    Transform,
    Transform2D,
    Trigger,
}

export const enum Has {
    Animate = 1 << Component.Animate,
    AudioListener = 1 << Component.AudioListener,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlMove = 1 << Component.ControlMove,
    Draw = 1 << Component.Draw,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Mimic = 1 << Component.Mimic,
    Move = 1 << Component.Move,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
    Transform2D = 1 << Component.Transform2D,
    Trigger = 1 << Component.Trigger,
}

export interface World {
    Signature: Array<number>;
    Graveyard: Array<Entity>;

    // Component data
    Animate: Array<Animate>;
    AudioSource: Array<AudioSource>;
    Camera: Array<Camera>;
    Children: Array<Children>;
    Collide: Array<Collide>;
    ControlMove: Array<ControlMove>;
    Draw: Array<Draw>;
    Lifespan: Array<Lifespan>;
    Light: Array<Light>;
    Mimic: Array<Mimic>;
    Move: Array<Move>;
    Named: Array<Named>;
    // Render depends on the version of WebGL. See com_render*, sys_render*.
    RigidBody: Array<RigidBody>;
    Shake: Array<Shake>;
    Transform: Array<Transform>;
    Transform2D: Array<Transform2D>;
    Trigger: Array<Trigger>;
}
