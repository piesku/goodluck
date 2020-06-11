import {Camera} from "./components/com_camera.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Render} from "./components/com_render.js";
import {Shake} from "./components/com_shake.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    EmitParticles,
    Render,
    Shake,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    EmitParticles = 1 << Component.EmitParticles,
    Render = 1 << Component.Render,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    EmitParticles: Array<EmitParticles> = [];
    Render: Array<Render> = [];
    Shake: Array<Shake> = [];
    Transform: Array<Transform> = [];
}
