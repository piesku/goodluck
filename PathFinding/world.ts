import {WorldImpl} from "../common/world.js";
import {Camera} from "./components/com_camera.js";
import {Children} from "./components/com_children.js";
import {Collide} from "./components/com_collide.js";
import {ControlDolly} from "./components/com_control_dolly.js";
import {ControlPlayer} from "./components/com_control_player.js";
import {Draw} from "./components/com_draw.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {NavAgent} from "./components/com_nav_agent.js";
import {Pickable} from "./components/com_pickable.js";
import {Render} from "./components/com_render.js";
import {Selectable} from "./components/com_selectable.js";
import {Transform} from "./components/com_transform.js";

const enum Component {
    Camera,
    Children,
    Collide,
    ControlDolly,
    ControlPlayer,
    Dirty,
    Draw,
    EmitParticles,
    Light,
    Move,
    NavAgent,
    Pickable,
    Render,
    Selectable,
    Transform,
}

export const enum Has {
    None = 0,
    Camera = 1 << Component.Camera,
    Children = 1 << Component.Children,
    Collide = 1 << Component.Collide,
    ControlDolly = 1 << Component.ControlDolly,
    ControlPlayer = 1 << Component.ControlPlayer,
    Dirty = 1 << Component.Dirty,
    Draw = 1 << Component.Draw,
    EmitParticles = 1 << Component.EmitParticles,
    Light = 1 << Component.Light,
    Move = 1 << Component.Move,
    NavAgent = 1 << Component.NavAgent,
    Pickable = 1 << Component.Pickable,
    Render = 1 << Component.Render,
    Selectable = 1 << Component.Selectable,
    Transform = 1 << Component.Transform,
}

export class World extends WorldImpl {
    Camera: Array<Camera> = [];
    Children: Array<Children> = [];
    Collide: Array<Collide> = [];
    ControlDolly: Array<ControlDolly> = [];
    ControlPlayer: Array<ControlPlayer> = [];
    Draw: Array<Draw> = [];
    EmitParticles: Array<EmitParticles> = [];
    Light: Array<Light> = [];
    Move: Array<Move> = [];
    NavAgent: Array<NavAgent> = [];
    Pickable: Array<Pickable> = [];
    Render: Array<Render> = [];
    Selectable: Array<Selectable> = [];
    Transform: Array<Transform> = [];
}
