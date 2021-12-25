import {Game3D} from "../common/game.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_ludek} from "../meshes/ludek.js";
import {mat_forward_colored_gouraud_skinned} from "./materials/mat_forward_colored_gouraud_skinned.js";
import {mat_forward_colored_phong_skinned} from "./materials/mat_forward_colored_phong_skinned.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio_listener} from "./systems/sys_audio_listener.js";
import {sys_audio_source} from "./systems/sys_audio_source.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control} from "./systems/sys_control.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_forward} from "./systems/sys_render_ext.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);
    MaterialColoredGouraudSkinned = mat_forward_colored_gouraud_skinned(this.Gl);
    MaterialColoredPhongSkinned = mat_forward_colored_phong_skinned(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshLudek = mesh_ludek(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    override FrameUpdate(delta: number) {
        // Camera.
        sys_resize(this, delta);
        sys_camera(this, delta);

        // Player input.
        sys_control(this, delta);

        // Game logic.
        sys_animate(this, delta);
        sys_transform(this, delta);

        // Rendering.
        sys_audio_listener(this, delta);
        sys_audio_source(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}
