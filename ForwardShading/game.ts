import {GameWebGL2} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat2_forward_colored_gouraud} from "../materials/mat2_forward_colored_gouraud.js";
import {mat2_forward_colored_phong} from "../materials/mat2_forward_colored_phong.js";
import {mat2_forward_colored_points} from "../materials/mat2_forward_colored_points.js";
import {
    mat2_forward_colored_unlit,
    mat2_forward_colored_wireframe,
} from "../materials/mat2_forward_colored_unlit.js";
import {mat2_forward_mapped_shaded} from "../materials/mat2_forward_mapped_shaded.js";
import {mat2_forward_textured_gouraud} from "../materials/mat2_forward_textured_gouraud.js";
import {mat2_forward_textured_phong} from "../materials/mat2_forward_textured_phong.js";
import {mat2_forward_textured_unlit} from "../materials/mat2_forward_textured_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends GameWebGL2 {
    World = new World();

    MaterialColoredPoints = mat2_forward_colored_points(this.Gl);
    MaterialColoredWireframe = mat2_forward_colored_wireframe(this.Gl);
    MaterialColoredUnlit = mat2_forward_colored_unlit(this.Gl);
    MaterialColoredGouraud = mat2_forward_colored_gouraud(this.Gl);
    MaterialColoredPhong = mat2_forward_colored_phong(this.Gl);
    MaterialTexturedUnlit = mat2_forward_textured_unlit(this.Gl);
    MaterialTexturedGouraud = mat2_forward_textured_gouraud(this.Gl);
    MaterialTexturedPhong = mat2_forward_textured_phong(this.Gl);
    MaterialMapped = mat2_forward_mapped_shaded(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshIcosphereSmooth = mesh_icosphere_smooth(this.Gl);

    Textures: Record<string, WebGLTexture> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_control_always(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}
