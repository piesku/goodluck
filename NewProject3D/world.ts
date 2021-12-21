import {WorldImpl} from "../common/world.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlAlways} from "./components/com_control_always.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Shake} from "./components/com_shake.js";
import {Spawn} from "./components/com_spawn.js";
import {Task} from "./components/com_task.js";
import {Toggle} from "./components/com_toggle.js";
import {Transform} from "./components/com_transform.js";
import {Trigger} from "./components/com_trigger.js";

const enum Component {
    Animate,
    AudioListener,
    AudioSource,
    Camera,
    Children,
    Collide,
    ControlAlways,
    ControlPlayer,
    Dirty,
    Draw,
    EmitParticles,
    Lifespan,
    Light,
    Mimic,
    Move,
    Named,
    Render,
    RigidBody,
    Shake,
    Spawn,
    Task,
    Toggle,
    Transform,
    Trigger,
}

export const enum Has {
    None = 0,
    Animate = 1 << Component.Animate,
    AudioListener = 1 << Component.AudioListener,
    AudioSource = 1 << Component.AudioSource,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlAlways = 1 << Component.ControlAlways,
    ControlPlayer = 1 << Component.ControlPlayer,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    EmitParticles = 1 << Component.EmitParticles,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Mimic = 1 << Component.Mimic,
    Move = 1 << Component.Move,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Shake = 1 << Component.Shake,
    Spawn = 1 << Component.Spawn,
    Task = 1 << Component.Task,
    Toggle = 1 << Component.Toggle,
    Transform = 1 << Component.Transform,
    Trigger = 1 << Component.Trigger,
}

export class World extends WorldImpl {
    Animate: Array<Animate> = [];
    AudioSource: Array<AudioSource> = [];
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Collide: Array<Collide> = [];
    ControlAlways: Array<ControlAlways> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    Draw: Array<Draw> = [];
    EmitParticles: Array<EmitParticles> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Mimic: Array<Mimic> = [];
    Move: Array<Move> = [];
    Named: Array<Named> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Shake: Array<Shake> = [];
    Spawn: Array<Spawn> = [];
    Task: Array<Task> = [];
    Toggle: Array<Toggle> = [];
    Transform: Array<Transform> = [];
    Trigger: Array<Trigger> = [];
}
