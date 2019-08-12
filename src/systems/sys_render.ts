import {Camera} from "../components/com_camera.js";
import {Get} from "../components/com_index.js";
import {LightDetails} from "../components/com_light.js";
import {RenderKind} from "../components/com_render.js";
import {RenderBasic} from "../components/com_render_basic.js";
import {RenderShaded} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Material} from "../materials/mat_common.js";
import {get_translation} from "../math/mat4.js";

const QUERY = Get.Transform | Get.Render;

export function sys_render(game: Game, delta: number) {
    game.gl.clear(game.gl.COLOR_BUFFER_BIT | game.gl.DEPTH_BUFFER_BIT);

    let lights_count = 0;
    let lights_positions = [];
    let lights_details = [];

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & Get.Light) === Get.Light) {
            lights_count++;
            let light_transform = game[Get.Transform][i];
            let position = get_translation([], light_transform.world);
            lights_positions.push(...position);
            let light = game[Get.Light][i];
            lights_details.push(...light.color, light.intensity);
        }
    }

    let lights = <LightDetails>{
        count: lights_count,
        positions: new Float32Array(lights_positions),
        details: new Float32Array(lights_details),
    };

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            // TODO Sort by material.
            if (render.material !== current_material) {
                current_material = render.material;
                // TODO Support more than one camera.
                use(render.material, game.cameras[0], lights);
            }

            switch (render.kind) {
                case RenderKind.Basic:
                    draw_basic(transform, render);
                    break;
                case RenderKind.Shaded:
                    draw_shaded(transform, render);
                    break;
            }
        }
    }
}

function use(material: Material, camera: Camera, lights: LightDetails) {
    let {gl, program, uniforms} = material;
    gl.useProgram(program);
    gl.uniformMatrix4fv(uniforms.pv, false, camera.pv);
    gl.uniform3fv(uniforms.camera_pos, camera.position);
    gl.uniform3fv(uniforms.light_positions, lights.positions);
    gl.uniform4fv(uniforms.light_details, lights.details);
    gl.uniform1i(uniforms.light_count, lights.count);
}

function draw_basic(transform: Transform, render: RenderBasic) {
    let {gl, mode, uniforms} = render.material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.world);
    gl.uniform4fv(uniforms.color, render.color);
    gl.bindVertexArray(render.vao);
    gl.drawElements(mode, render.count, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}

function draw_shaded(transform: Transform, render: RenderShaded) {
    let {gl, mode, uniforms} = render.material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.world);
    gl.uniformMatrix4fv(uniforms.self, false, transform.self);
    gl.uniform4fv(uniforms.color, render.color);
    gl.bindVertexArray(render.vao);
    gl.drawElements(mode, render.count, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}
