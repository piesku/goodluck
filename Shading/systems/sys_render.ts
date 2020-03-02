import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {BasicUniform, RenderBasic} from "../components/com_render_basic.js";
import {DiffuseUniform, RenderDiffuse} from "../components/com_render_diffuse.js";
import {RenderSpecular, SpecularUniform} from "../components/com_render_specular.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.GL.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                game.GL.useProgram(current_material.Program);
                switch (render.Kind) {
                    case RenderKind.Basic:
                        game.GL.uniformMatrix4fv(
                            current_material.Uniforms[BasicUniform.PV],
                            false,
                            game.Camera!.PV
                        );
                        break;
                    case RenderKind.Diffuse:
                        game.GL.uniformMatrix4fv(
                            current_material.Uniforms[DiffuseUniform.PV],
                            false,
                            game.Camera!.PV
                        );
                        game.GL.uniform1i(
                            current_material.Uniforms[DiffuseUniform.LightCount],
                            game.LightPositions.length / 3
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[DiffuseUniform.LightPositions],
                            game.LightPositions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[DiffuseUniform.LightDetails],
                            game.LightDetails
                        );
                        break;
                    case RenderKind.Specular:
                        game.GL.uniformMatrix4fv(
                            current_material.Uniforms[SpecularUniform.PV],
                            false,
                            game.Camera!.PV
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[SpecularUniform.Eye],
                            game.Camera!.Eye
                        );
                        game.GL.uniform1i(
                            current_material.Uniforms[SpecularUniform.LightCount],
                            game.LightPositions.length / 3
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[SpecularUniform.LightPositions],
                            game.LightPositions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[SpecularUniform.LightDetails],
                            game.LightDetails
                        );
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Basic:
                    draw_basic(game, transform, render);
                    break;
                case RenderKind.Diffuse:
                    draw_diffuse(game, transform, render);
                    break;
                case RenderKind.Specular:
                    draw_specular(game, transform, render);
                    break;
            }
        }
    }
}

function draw_basic(game: Game, transform: Transform, render: RenderBasic) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[BasicUniform.World], false, transform.World);
    game.GL.uniform4fv(render.Material.Uniforms[BasicUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}

function draw_diffuse(game: Game, transform: Transform, render: RenderDiffuse) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[DiffuseUniform.World],
        false,
        transform.World
    );
    game.GL.uniformMatrix4fv(render.Material.Uniforms[DiffuseUniform.Self], false, transform.Self);
    game.GL.uniform4fv(render.Material.Uniforms[DiffuseUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}

function draw_specular(game: Game, transform: Transform, render: RenderSpecular) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[SpecularUniform.World],
        false,
        transform.World
    );
    game.GL.uniformMatrix4fv(render.Material.Uniforms[SpecularUniform.Self], false, transform.Self);
    game.GL.uniform4fv(render.Material.Uniforms[SpecularUniform.ColorDiffuse], render.ColorDiffuse);
    game.GL.uniform4fv(
        render.Material.Uniforms[SpecularUniform.ColorSpecular],
        render.ColorSpecular
    );
    game.GL.uniform1f(render.Material.Uniforms[SpecularUniform.Shininess], render.Shininess);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
