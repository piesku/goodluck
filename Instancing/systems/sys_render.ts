import {Material} from "../../common/material.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {InstancedUniform, RenderInstanced} from "../components/com_render_instanced.js";
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
                    case RenderKind.Instanced:
                        use_instanced(game, current_material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Instanced:
                    draw_instanced(game, transform, render);
                    break;
            }
        }
    }
}

function use_instanced(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[InstancedUniform.PV], false, game.Camera!.PV);
    game.GL.uniform1i(
        material.Uniforms[InstancedUniform.LightCount],
        game.LightPositions.length / 3
    );
    game.GL.uniform3fv(material.Uniforms[InstancedUniform.LightPositions], game.LightPositions);
    game.GL.uniform4fv(material.Uniforms[InstancedUniform.LightDetails], game.LightDetails);
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[InstancedUniform.World],
        false,
        transform.World
    );
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[InstancedUniform.Self],
        false,
        transform.Self
    );
    game.GL.uniform3fv(render.Material.Uniforms[InstancedUniform.Palette], render.Palette);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElementsInstanced(
        render.Material.Mode,
        render.Mesh.Count,
        GL_UNSIGNED_SHORT,
        0,
        render.InstanceCount
    );
    game.GL.bindVertexArray(null);
}
