import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderBasic} from "../components/com_render_basic.js";
import {RenderShaded} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);

export function sys_render(game: Game, delta: number) {
    game.GL.clear(game.GL.COLOR_BUFFER_BIT | game.GL.DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.Lights.length; i++) {
        let light = game.Lights[i];
        let transform = game[Get.Transform][light.EntityId];
        let position = get_translation([], transform.World);
        light_positions.push(...position);
        light_details.push(...light.Color, light.Intensity);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            // TODO Sort by material.
            if (render.Material !== current_material) {
                current_material = render.Material;

                let {gl, program, uniforms} = current_material;
                gl.useProgram(program);
                // TODO Support more than one camera.
                gl.uniformMatrix4fv(uniforms.pv, false, game.Cameras[0].PV);

                switch (render.Kind) {
                    case RenderKind.Shaded:
                        gl.uniform1i(uniforms.light_count, game.Lights.length);
                        gl.uniform3fv(uniforms.light_positions, light_positions);
                        gl.uniform4fv(uniforms.light_details, light_details);
                        break;
                }
            }

            switch (render.Kind) {
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
    let {gl, mode, uniforms} = render.Material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.World);
    gl.uniform4fv(uniforms.color, render.Color);
    gl.bindVertexArray(render.VAO);
    gl.drawElements(mode, render.Count, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}

function draw_shaded(transform: Transform, render: RenderShaded) {
    let {gl, mode, uniforms} = render.Material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.World);
    gl.uniformMatrix4fv(uniforms.self, false, transform.Self);
    gl.uniform4fv(uniforms.color, render.Color);
    gl.bindVertexArray(render.VAO);
    gl.drawElements(mode, render.Count, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}
