import {Get, Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {BasicUniform, RenderBasic} from "../components/com_render_basic.js";
import {RenderShaded, ShadedUniform} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../webgl.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.Lights.length; i++) {
        let light = game.Lights[i];
        let transform = game[Get.Transform][light.EntityId];
        let position = get_translation([0, 0, 0], transform.World);
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

                game.GL.useProgram(current_material.Program);
                // TODO Support more than one camera.
                // XXX Uniforms[0] should always be PV.
                game.GL.uniformMatrix4fv(current_material.Uniforms[0], false, game.Cameras[0].PV);

                switch (render.Kind) {
                    case RenderKind.Shaded:
                        game.GL.uniform1i(
                            current_material.Uniforms[ShadedUniform.LightCount],
                            game.Lights.length
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[ShadedUniform.LightPositions],
                            light_positions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[ShadedUniform.LightDetails],
                            light_details
                        );
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Basic:
                    draw_basic(game, transform, render);
                    break;
                case RenderKind.Shaded:
                    draw_shaded(game, transform, render);
                    break;
            }
        }
    }
}

function draw_basic(game: Game, transform: Transform, render: RenderBasic) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[BasicUniform.World], false, transform.World);
    game.GL.uniform4fv(render.Material.Uniforms[BasicUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}

function draw_shaded(game: Game, transform: Transform, render: RenderShaded) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.World], false, transform.World);
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.Self], false, transform.Self);
    game.GL.uniform4fv(render.Material.Uniforms[ShadedUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
