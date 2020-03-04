import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat_diffuse_gouraud} from "./materials/mat_diffuse_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_spawner} from "./systems/sys_control_spawner.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_physics} from "./systems/sys_physics.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;

    UI = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    GL = this.Canvas.getContext("webgl2")!;

    MaterialDiffuseGouraud = mat_diffuse_gouraud(this.GL);
    MeshCube = mesh_cube(this.GL);

    Camera?: Camera;
    LightPositions: Array<number> = [];
    LightDetails: Array<number> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        // Destroy entities past their age.
        sys_lifespan(this, delta);

        // Input and AI.
        sys_control_spawner(this, delta);

        // Collisions and physics.
        sys_collide(this, delta);
        sys_physics(this, delta);
        sys_transform(this, delta);

        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
