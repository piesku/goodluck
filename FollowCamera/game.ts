import {Game3D} from "../lib/game.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mat_forward_colored_phong} from "../materials/mat_forward_colored_phong.js";
import {mat_forward_colored_wireframe} from "../materials/mat_forward_colored_unlit.js";
import {mat_forward_particles_colored} from "../materials/mat_forward_particles_colored.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_monkey_smooth} from "../meshes/monkey_smooth.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_follow} from "./systems/sys_follow.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_look_at} from "./systems/sys_look_at.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_physics_integrate} from "./systems/sys_physics_integrate.js";
import {sys_physics_resolve} from "./systems/sys_physics_resolve.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialWireframe = mat_forward_colored_wireframe(this.Gl);
    MaterialColoredShaded = mat_forward_colored_phong(this.Gl);
    MaterialParticlesColored = mat_forward_particles_colored(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshMonkey = mesh_monkey_smooth(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    ItemsCollected = 0;
    ItemsMissed = 0;

    override FrameUpdate(delta: number) {
        // Collisions and physics.
        sys_physics_integrate(this, delta);
        sys_transform(this, delta);
        sys_collide(this, delta);
        sys_physics_resolve(this, delta);
        sys_transform(this, delta);

        // Camera.
        sys_resize(this, delta);
        sys_camera(this, delta);

        // Player input.
        sys_control_keyboard(this, delta);

        // Game logic.
        sys_move(this, delta);
        sys_follow(this, delta);
        sys_look_at(this, delta);
        sys_transform(this, delta);

        if (false) {
            sys_debug(this, delta);
        }

        // Rendering.
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}

export const enum Layer {
    None = 0,
    Player = 1,
    Terrain = 2,
    Obstacle = 4,
    Collectable = 8,
}
