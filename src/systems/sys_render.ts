import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderBasic} from "../components/com_render_basic.js";
import {RenderShaded} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);

export function sys_render(game: Game, delta: number) {
    game.gl.clear(game.gl.COLOR_BUFFER_BIT | game.gl.DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.lights.length; i++) {
        let light = game.lights[i];
        let transform = game[Get.Transform][light.entity];
        let position = get_translation([], transform.world);
        light_positions.push(...position);
        light_details.push(...light.color, light.intensity);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            // TODO Sort by material.
            if (render.material !== current_material) {
                current_material = render.material;

                let {gl, program, uniforms} = current_material;
                gl.useProgram(program);
                // TODO Support more than one camera.
                gl.uniformMatrix4fv(uniforms.pv, false, game.cameras[0].pv);

                switch (render.kind) {
                    case RenderKind.Shaded:
                        gl.uniform1i(uniforms.light_count, game.lights.length);
                        gl.uniform3fv(uniforms.light_positions, light_positions);
                        gl.uniform4fv(uniforms.light_details, light_details);
                        break;
                }
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
