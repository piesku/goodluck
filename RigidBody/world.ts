import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {ControlSpawner} from "./components/com_control_spawner.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Collide,
    ControlSpawner,
    Lifespan,
    Light,
    Render,
    RigidBody,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlSpawner = 1 << Component.ControlSpawner,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Transform = 1 << Component.Transform,
}

export class World {
    // Component flags
    Mask: Array<number> = [];
    // Component data
    Camera: Array<Camera> = [];
    Collide: Array<Collide> = [];
    ControlSpawner: Array<ControlSpawner> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Transform: Array<Transform> = [];
}
