import {WorldImpl} from "../common/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {ControlXr} from "./components/com_control_xr.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Children,
    ControlXr,
    Dirty,
    EmitParticles,
    Light,
    Render,
    Transform,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    ControlXr = 1 << Component.ControlXr,
    Dirty = 1 << Component.Dirty,
    EmitParticles = 1 << Component.EmitParticles,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    ControlXr: Array<ControlXr> = [];
    EmitParticles: Array<EmitParticles> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    Transform: Array<Transform> = [];
}
