import {Animate} from "./components/com_animate";
import {AudioSource} from "./components/com_audio_source";
import {Camera} from "./components/com_camera";
import {Collide} from "./components/com_collide";
import {Draw} from "./components/com_draw";
import {Lifespan} from "./components/com_lifespan";
import {Light} from "./components/com_light";
import {Mimic} from "./components/com_mimic";
import {Move} from "./components/com_move";
import {Named} from "./components/com_named";
import {PlayerControl} from "./components/com_player_control";
import {Render} from "./components/com_render";
import {RigidBody} from "./components/com_rigid_body";
import {Shake} from "./components/com_shake";
import {Transform} from "./components/com_transform";
import {Transform2D} from "./components/com_transform2d";
import {Trigger} from "./components/com_trigger";

export class World {
    // Bit flags
    Mask: Array<number> = [];
    // Component data
    Animate: Array<Animate> = [];
    AudioSource: Array<AudioSource> = [];
    Camera: Array<Camera> = [];
    Collide: Array<Collide> = [];
    Draw: Array<Draw> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Mimic: Array<Mimic> = [];
    Move: Array<Move> = [];
    Named: Array<Named> = [];
    PlayerControl: Array<PlayerControl> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Shake: Array<Shake> = [];
    Transform: Array<Transform> = [];
    Transform2D: Array<Transform2D> = [];
    Trigger: Array<Trigger> = [];
}
