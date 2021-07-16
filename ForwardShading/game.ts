import {Game3D} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat_forward_colored_flat} from "../materials/mat_forward_colored_flat.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mat_forward_colored_phong} from "../materials/mat_forward_colored_phong.js";
import {mat_forward_colored_points} from "../materials/mat_forward_colored_points.js";
import {
    mat_forward_colored_unlit,
    mat_forward_colored_wireframe,
} from "../materials/mat_forward_colored_unlit.js";
import {mat_forward_mapped_shaded} from "../materials/mat_forward_mapped_shaded.js";
import {mat_forward_textured_gouraud} from "../materials/mat_forward_textured_gouraud.js";
import {mat_forward_textured_phong} from "../materials/mat_forward_textured_phong.js";
import {mat_forward_textured_unlit} from "../materials/mat_forward_textured_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialColoredPoints = mat_forward_colored_points(this.Gl);
    MaterialColoredWireframe = mat_forward_colored_wireframe(this.Gl);
    MaterialColoredUnlit = mat_forward_colored_unlit(this.Gl);
    MaterialColoredFlat = mat_forward_colored_flat(this.Gl);
    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);
    MaterialColoredPhong = mat_forward_colored_phong(this.Gl);
    MaterialTexturedUnlit = mat_forward_textured_unlit(this.Gl);
    MaterialTexturedGouraud = mat_forward_textured_gouraud(this.Gl);
    MaterialTexturedPhong = mat_forward_textured_phong(this.Gl);
    MaterialMapped = mat_forward_mapped_shaded(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshIcosphereSmooth = mesh_icosphere_smooth(this.Gl);
    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);

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
