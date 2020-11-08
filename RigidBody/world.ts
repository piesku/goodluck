import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {ControlMove} from "./components/com_control_move.js";
import {ControlSpawner} from "./components/com_control_spawner.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render1.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Collide,
    ControlMove,
    ControlSpawner,
    Lifespan,
    Light,
    Move,
    Render,
    RigidBody,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Collide = 1 << Component.Collide,
    ControlMove = 1 << Component.ControlMove,
    ControlSpawner = 1 << Component.ControlSpawner,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    Collide: Array<Collide> = [];
    ControlMove: Array<ControlMove> = [];
    ControlSpawner: Array<ControlSpawner> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Transform: Array<Transform> = [];
}
