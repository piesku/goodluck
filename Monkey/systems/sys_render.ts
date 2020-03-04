import {Material} from "../../common/material.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
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
    let current_front_face = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.Diffuse:
                        use_diffuse(game, current_material);
                        break;
                    case RenderKind.Specular:
                        use_specular(game, current_material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
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

function use_diffuse(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[DiffuseUniform.PV], false, game.Camera!.PV);
    game.GL.uniform1i(material.Uniforms[DiffuseUniform.LightCount], game.LightPositions.length / 3);
    game.GL.uniform3fv(material.Uniforms[DiffuseUniform.LightPositions], game.LightPositions);
    game.GL.uniform4fv(material.Uniforms[DiffuseUniform.LightDetails], game.LightDetails);
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

function use_specular(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[SpecularUniform.PV], false, game.Camera!.PV);
    game.GL.uniform3fv(material.Uniforms[SpecularUniform.Eye], game.Camera!.Position);
    game.GL.uniform1i(
        material.Uniforms[SpecularUniform.LightCount],
        game.LightPositions.length / 3
    );
    game.GL.uniform3fv(material.Uniforms[SpecularUniform.LightPositions], game.LightPositions);
    game.GL.uniform4fv(material.Uniforms[SpecularUniform.LightDetails], game.LightDetails);
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
