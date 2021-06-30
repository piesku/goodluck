import {WorldImpl} from "../common/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Render} from "./components/com_render.js";
import {Shake} from "./components/com_shake.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Children,
    EmitParticles,
    Render,
    Shake,
    Transform,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    EmitParticles = 1 << Component.EmitParticles,
    Render = 1 << Component.Render,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    EmitParticles: Array<EmitParticles> = [];
    Render: Array<Render> = [];
    Shake: Array<Shake> = [];
    Transform: Array<Transform> = [];
}
