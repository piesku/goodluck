import {WorldImpl} from "../common/world.js";
import {Animate} from "./components/com_animate.js";
import {AnimateSprite} from "./components/com_animate_sprite.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlAlways} from "./components/com_control_always.js";
import {ControlAlways2D} from "./components/com_control_always2d.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Follow} from "./components/com_follow.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Local2D} from "./components/com_local2d.js";
import {LookAt} from "./components/com_look_at.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Move2D} from "./components/com_move2d.js";
import {Named} from "./components/com_named.js";
import {Render} from "./components/com_render.js";
import {Render2D} from "./components/com_render2d.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {RigidBody2D} from "./components/com_rigid_body2d.js";
import {Shake} from "./components/com_shake.js";
import {Spawn} from "./components/com_spawn.js";
import {Task} from "./components/com_task.js";
import {Toggle} from "./components/com_toggle.js";
import {Transform} from "./components/com_transform.js";
import {Transform2D} from "./components/com_transform2d.js";
import {Trigger} from "./components/com_trigger.js";

const enum Component {
    Animate,
    AnimateSprite,
    AudioListener,
    AudioSource,
    Camera,
    Children,
    Collide,
    ControlAlways,
    ControlAlways2D,
    ControlPlayer,
    Dirty,
    Draw,
    EmitParticles,
    Follow,
    Lifespan,
    Light,
    Local2D,
    LookAt,
    Mimic,
    Move,
    Move2D,
    Named,
    Render,
    Render2D,
    RigidBody,
    RigidBody2D,
    Shake,
    Spawn,
    Task,
    Toggle,
    Transform,
    Transform2D,
    Trigger,
}

export const enum Has {
    None = 0,
    Animate = 1 << Component.Animate,
    AnimateSprite = 1 << Component.AnimateSprite,
    AudioListener = 1 << Component.AudioListener,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlAlways = 1 << Component.ControlAlways,
    ControlAlways2D = 1 << Component.ControlAlways2D,
    ControlPlayer = 1 << Component.ControlPlayer,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    EmitParticles = 1 << Component.EmitParticles,
    Follow = 1 << Component.Follow,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Local2D = 1 << Component.Local2D,
    LookAt = 1 << Component.LookAt,
    Mimic = 1 << Component.Mimic,
    Move = 1 << Component.Move,
    Move2D = 1 << Component.Move2D,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    Render2D = 1 << Component.Render2D,
    RigidBody = 1 << Component.RigidBody,
    RigidBody2D = 1 << Component.RigidBody2D,
    Shake = 1 << Component.Shake,
    Spawn = 1 << Component.Spawn,
    Task = 1 << Component.Task,
    Toggle = 1 << Component.Toggle,
    Transform = 1 << Component.Transform,
    Transform2D = 1 << Component.Transform2D,
    Trigger = 1 << Component.Trigger,
}

export interface World extends WorldImpl {
    Animate: Array<Animate>;
    AnimateSprite: Array<AnimateSprite>;
    AudioSource: Array<AudioSource>;
    Camera: Array<Camera>;
    Children: Array<Children>;
    Collide: Array<Collide>;
    ControlAlways: Array<ControlAlways>;
    ControlAlways2D: Array<ControlAlways2D>;
    ControlPlayer: Array<ControlPlayer>;
    Draw: Array<Draw>;
    EmitParticles: Array<EmitParticles>;
    Follow: Array<Follow>;
    Lifespan: Array<Lifespan>;
    Light: Array<Light>;
    Local2D: Array<Local2D>;
    LookAt: Array<LookAt>;
    Mimic: Array<Mimic>;
    Move: Array<Move>;
    Move2D: Array<Move2D>;
    Named: Array<Named>;
    Render: Array<Render>;
    Render2D: Array<Render2D>;
    RigidBody: Array<RigidBody>;
    RigidBody2D: Array<RigidBody2D>;
    Shake: Array<Shake>;
    Spawn: Array<Spawn>;
    Task: Array<Task>;
    Toggle: Array<Toggle>;
    Transform: Array<Transform>;
    Transform2D: Array<Transform2D>;
    Trigger: Array<Trigger>;
}
