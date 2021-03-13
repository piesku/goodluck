import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlMove} from "./components/com_control_move.js";
import {ControlSpawn} from "./components/com_control_spawn.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Render} from "./components/com_render1.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Shake} from "./components/com_shake.js";
import {Transform} from "./components/com_transform.js";
import {Entity} from "./game.js";

const enum Component {
    Camera,
    Children,
    Collide,
    ControlMove,
    ControlSpawn,
    Lifespan,
    Light,
    Move,
    Render,
    RigidBody,
    Shake,
    Transform,
}

export const enum Has {
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlMove = 1 << Component.ControlMove,
    ControlSpawn = 1 << Component.ControlSpawn,
    Lifespan = 1 << Component.Lifespan,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Shake = 1 << Component.Shake,
    Transform = 1 << Component.Transform,
}

export class World {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    // Component data
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Collide: Array<Collide> = [];
    ControlMove: Array<ControlMove> = [];
    ControlSpawn: Array<ControlSpawn> = [];
    Lifespan: Array<Lifespan> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Shake: Array<Shake> = [];
    Transform: Array<Transform> = [];
}
