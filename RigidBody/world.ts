import {WorldImpl} from "../lib/world.js";
import {Animate} from "./components/com_animate.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlAlways} from "./components/com_control_always.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Shake} from "./components/com_shake.js";
import {Spawn} from "./components/com_spawn.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Animate, // Required by ControlAlways.
    Camera,
    Children,
    Collide,
    ControlAlways,
    Dirty,
    EmitParticles, // Required by Render.
    Lifespan,
    Light,
    Move,
    Render,
    RigidBody,
    Shake,
    Spawn,
    Transform,
}

export const enum Has {
    None = 0,
    Animate = 1 << Component.Animate,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlAlways = 1 << Component.ControlAlways,
    Dirty = 1 << Component.Dirty,
    EmitParticles = 1 << Component.EmitParticles,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Shake = 1 << Component.Shake,
    Spawn = 1 << Component.Spawn,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Animate: Array<Animate> = [];
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Collide: Array<Collide> = [];
    ControlAlways: Array<ControlAlways> = [];
    EmitParticles: Array<EmitParticles> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Shake: Array<Shake> = [];
    Spawn: Array<Spawn> = [];
    Transform: Array<Transform> = [];
}
