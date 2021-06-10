import {GameImpl} from "../common/game.js";
import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {Entity} from "../common/world.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_ludek} from "../meshes/ludek.js";
import {mat1_forward_colored_gouraud_skinned} from "./materials/mat1_forward_colored_gouraud_skinned.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio_listener} from "./systems/sys_audio_listener.js";
import {sys_audio_source} from "./systems/sys_audio_source.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control} from "./systems/sys_control.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_forward} from "./systems/sys_render_ext.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_rig} from "./systems/sys_rig.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";
export {Entity} from "../common/world.js";

export class Game extends GameImpl {
    World = new World();

    Billboard = document.querySelector("#billboard")! as HTMLCanvasElement;
    Canvas = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;
    Audio = new (window["AudioContext"] || window.webkitAudioContext)();

    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);
    MaterialColoredSkinned = mat1_forward_colored_gouraud_skinned(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshLudek = mesh_ludek(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    constructor() {
        super();

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
    }

    FrameUpdate(delta: number) {
        // Player input.
        sys_control(this, delta);

        // Game logic.
        sys_transform(this, delta);
        sys_rig(this, delta);
        sys_animate(this, delta);
        sys_transform(this, delta);

        // Rendering.
        sys_audio_listener(this, delta);
        sys_audio_source(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}
