import {WorldImpl} from "../lib/world.js";
import {Animate} from "./components/com_animate.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {ControlAlways} from "./components/com_control_always.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Animate, // Required by ControlAlways.
    Camera,
    Children,
    ControlAlways,
    Dirty,
    EmitParticles, // Required by Render.
    Light,
    Move,
    Render,
    Transform,
}

export const enum Has {
    None = 0,
    Animate = 1 << Component.Animate,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    ControlAlways = 1 << Component.ControlAlways,
    Dirty = 1 << Component.Dirty,
    EmitParticles = 1 << Component.EmitParticles,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Animate: Array<Animate> = [];
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    ControlAlways: Array<ControlAlways> = [];
    EmitParticles: Array<EmitParticles> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
