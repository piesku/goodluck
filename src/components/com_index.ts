import {Animate} from "./com_animate";
import {AudioSource} from "./com_audio_source";
import {Camera} from "./com_camera";
import {Collide} from "./com_collide";
import {Draw} from "./com_draw";
import {Lifespan} from "./com_lifespan";
import {Light} from "./com_light";
import {Mimic} from "./com_mimic";
import {Move} from "./com_move";
import {Named} from "./com_named";
import {PlayerControl} from "./com_player_control";
import {Render} from "./com_render";
import {RigidBody} from "./com_rigid_body";
import {Shake} from "./com_shake";
import {Transform} from "./com_transform";
import {Transform2D} from "./com_transform2d";
import {Trigger} from "./com_trigger";

export const enum Get {
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
    PlayerControl,
    Render,
    RigidBody,
    Shake,
    Transform,
    Transform2D,
    Trigger,
}

export interface ComponentData {
    [Get.Animate]: Array<Animate>;
    [Get.AudioSource]: Array<AudioSource>;
    [Get.Camera]: Array<Camera>;
    [Get.Collide]: Array<Collide>;
    [Get.Draw]: Array<Draw>;
    [Get.Lifespan]: Array<Lifespan>;
    [Get.Light]: Array<Light>;
    [Get.Mimic]: Array<Mimic>;
    [Get.Move]: Array<Move>;
    [Get.Named]: Array<Named>;
    [Get.PlayerControl]: Array<PlayerControl>;
    [Get.Render]: Array<Render>;
    [Get.RigidBody]: Array<RigidBody>;
    [Get.Shake]: Array<Shake>;
    [Get.Transform]: Array<Transform>;
    [Get.Transform2D]: Array<Transform2D>;
    [Get.Trigger]: Array<Trigger>;
}

export const enum Has {
    Animate = 1 << Get.Animate,
    AudioSource = 1 << Get.AudioSource,
    Camera = 1 << Get.Camera,
    Collide = 1 << Get.Collide,
    Draw = 1 << Get.Draw,
    Lifespan = 1 << Get.Lifespan,
    Light = 1 << Get.Light,
    Mimic = 1 << Get.Mimic,
    Move = 1 << Get.Move,
    Named = 1 << Get.Named,
    PlayerControl = 1 << Get.PlayerControl,
    Render = 1 << Get.Render,
    RigidBody = 1 << Get.RigidBody,
    Shake = 1 << Get.Shake,
    Transform = 1 << Get.Transform,
    Transform2D = 1 << Get.Transform2D,
    Trigger = 1 << Get.Trigger,
}
