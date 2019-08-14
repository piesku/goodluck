import {Animate} from "./com_animate";
import {AudioSource} from "./com_audio_source";
import {Camera} from "./com_camera";
import {Collide} from "./com_collide";
import {Light} from "./com_light";
import {Move} from "./com_move";
import {Named} from "./com_named";
import {PlayerControl} from "./com_player_control";
import {Render} from "./com_render";
import {RigidBody} from "./com_rigid_body";
import {Rotate} from "./com_rotate";
import {Transform} from "./com_transform";

export const enum Get {
    Transform,
    Render,
    Camera,
    Light,
    Rotate,
    AudioSource,
    Animate,
    Named,
    PlayerControl,
    Move,
    Collide,
    RigidBody,
}

export interface ComponentData {
    [Get.Transform]: Array<Transform>;
    [Get.Render]: Array<Render>;
    [Get.Camera]: Array<Camera>;
    [Get.Light]: Array<Light>;
    [Get.Rotate]: Array<Rotate>;
    [Get.AudioSource]: Array<AudioSource>;
    [Get.Animate]: Array<Animate>;
    [Get.Named]: Array<Named>;
    [Get.Move]: Array<Move>;
    [Get.PlayerControl]: Array<PlayerControl>;
    [Get.Collide]: Array<Collide>;
    [Get.RigidBody]: Array<RigidBody>;
}
