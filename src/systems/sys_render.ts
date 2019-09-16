import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderBasic} from "../components/com_render_basic.js";
import {RenderShaded} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../webgl.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

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

                let {GL, Program, Uniforms} = current_material;
                GL.useProgram(Program);
                // TODO Support more than one camera.
                GL.uniformMatrix4fv(Uniforms.pv, false, game.Cameras[0].PV);

                switch (render.Kind) {
                    case RenderKind.Shaded:
                        GL.uniform1i(Uniforms.light_count, game.Lights.length);
                        GL.uniform3fv(Uniforms.light_positions, light_positions);
                        GL.uniform4fv(Uniforms.light_details, light_details);
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
    let {GL, Mode, Uniforms} = render.Material;
    GL.uniformMatrix4fv(Uniforms.world, false, transform.World);
    GL.uniform4fv(Uniforms.color, render.Color);
    GL.bindVertexArray(render.VAO);
    GL.drawElements(Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    GL.bindVertexArray(null);
}

function draw_shaded(transform: Transform, render: RenderShaded) {
    let {GL, Mode, Uniforms} = render.Material;
    GL.uniformMatrix4fv(Uniforms.world, false, transform.World);
    GL.uniformMatrix4fv(Uniforms.self, false, transform.Self);
    GL.uniform4fv(Uniforms.color, render.Color);
    GL.bindVertexArray(render.VAO);
    GL.drawElements(Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    GL.bindVertexArray(null);
}
