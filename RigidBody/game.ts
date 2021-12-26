import {Game3D} from "../common/game.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mat_forward_colored_wireframe} from "../materials/mat_forward_colored_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_hand} from "../meshes/hand.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_physics_integrate} from "./systems/sys_physics_integrate.js";
import {sys_physics_kinematic} from "./systems/sys_physics_kinematic.js";
import {sys_physics_resolve} from "./systems/sys_physics_resolve.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_spawn} from "./systems/sys_spawn.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialWireframe = mat_forward_colored_wireframe(this.Gl);
    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshHand = mesh_hand(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    override FixedUpdate(delta: number) {
        // Collisions and physics.
        sys_physics_integrate(this, delta);
        sys_transform(this, delta);
        sys_physics_kinematic(this, delta);
        sys_collide(this, delta);
        sys_physics_resolve(this, delta);
        sys_transform(this, delta);
    }

    override FrameUpdate(delta: number) {
        // Destroy entities past their age.
        sys_lifespan(this, delta);

        // Camera.
        sys_resize(this, delta);
        sys_camera(this, delta);

        // Input and AI.
        sys_control_always(this, delta);

        // Game logic.
        sys_move(this, delta);
        sys_shake(this, delta);
        sys_spawn(this, delta);
        sys_transform(this, delta);

        if (true) {
            sys_debug(this, delta);
        }

        // Rendering.
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}

export const enum Layer {
    None = 0,
    Terrain = 1,
    Physics = 2,
}
