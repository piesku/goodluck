import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FLOAT,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {BasicAttribute, BasicUniform, RenderBasic} from "../components/com_render_basic.js";
import {DiffuseUniform, RenderDiffuse} from "../components/com_render_diffuse.js";
import {RenderPath} from "../components/com_render_path.js";
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
                    case RenderKind.Basic:
                        use_basic(game, current_material);
                        break;
                    case RenderKind.Diffuse:
                        use_diffuse(game, current_material);
                        break;
                    case RenderKind.Path:
                        use_path(game, current_material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Basic:
                    draw_basic(game, transform, render);
                    break;
                case RenderKind.Diffuse:
                    draw_diffuse(game, transform, render);
                    break;
                case RenderKind.Path:
                    draw_path(game, transform, render);
                    break;
            }
        }
    }
}

function use_basic(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[BasicUniform.PV], false, game.Camera!.PV);
}

function draw_basic(game: Game, transform: Transform, render: RenderBasic) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[BasicUniform.World], false, transform.World);
    game.GL.uniform4fv(render.Material.Uniforms[BasicUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}

function use_diffuse(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[DiffuseUniform.PV], false, game.Camera!.PV);
    game.GL.uniform4fv(material.Uniforms[DiffuseUniform.LightPositions], game.LightPositions);
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
    game.GL.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}

function use_path(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[BasicUniform.PV], false, game.Camera!.PV);
}

function draw_path(game: Game, transform: Transform, render: RenderPath) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[BasicUniform.World], false, transform.World);
    game.GL.uniform4fv(render.Material.Uniforms[BasicUniform.Color], render.Color);
    game.GL.bindBuffer(GL_ARRAY_BUFFER, render.VertexBuffer);
    game.GL.enableVertexAttribArray(BasicAttribute.Position);
    game.GL.vertexAttribPointer(BasicAttribute.Position, 3, GL_FLOAT, false, 0, 0);
    game.GL.drawArrays(render.Material.Mode, 0, render.IndexCount);
}
