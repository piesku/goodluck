import {WorldImpl} from "../lib/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Follow} from "./components/com_follow.js";
import {Light} from "./components/com_light.js";
import {LookAt} from "./components/com_look_at.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Children,
    Collide,
    ControlPlayer,
    Dirty,
    EmitParticles,
    Follow,
    Light,
    LookAt,
    Move,
    Named,
    Render,
    RigidBody,
    Transform,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlPlayer = 1 << Component.ControlPlayer,
    Dirty = 1 << Component.Dirty,
    EmitParticles = 1 << Component.EmitParticles,
    Follow = 1 << Component.Follow,
    Light = 1 << Component.Light,
    LookAt = 1 << Component.LookAt,
    Move = 1 << Component.Move,
    Named = 1 << Component.Named,
    Render = 1 << Component.Render,
    RigidBody = 1 << Component.RigidBody,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Collide: Array<Collide> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    EmitParticles: Array<EmitParticles> = [];
    Follow: Array<Follow> = [];
    Light: Array<Light> = [];
    LookAt: Array<LookAt> = [];
    Move: Array<Move> = [];
    Named: Array<Named> = [];
    Render: Array<Render> = [];
    RigidBody: Array<RigidBody> = [];
    Transform: Array<Transform> = [];
}
