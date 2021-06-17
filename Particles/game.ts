import {GameWebGL1} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat1_forward_particles_colored} from "./materials/mat1_forward_particles_colored.js";
import {mat1_forward_particles_textured} from "./materials/mat1_forward_particles_textured.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends GameWebGL1 {
    World = new World();

    MaterialParticlesColored = mat1_forward_particles_colored(this.Gl);
    MaterialParticlesTextured = mat1_forward_particles_textured(this.Gl);
    Textures: Record<string, WebGLTexture> = {};

    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_particles(this, delta);
        sys_shake(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_render_forward(this, delta);
    }
}
