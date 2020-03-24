import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderTextured, TexturedUniform} from "../components/com_render_textured.js";
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
                    case RenderKind.Textured:
                        use_textured(game, current_material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Textured:
                    draw_textured(game, transform, render);
                    break;
            }
        }
    }
}

function use_textured(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[TexturedUniform.PV], false, game.Camera!.PV);
}

function draw_textured(game: Game, transform: Transform, render: RenderTextured) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[TexturedUniform.World],
        false,
        transform.World
    );
    game.GL.uniformMatrix4fv(render.Material.Uniforms[TexturedUniform.Self], false, transform.Self);

    game.GL.activeTexture(GL_TEXTURE0);
    game.GL.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.GL.uniform1i(render.Material.Uniforms[TexturedUniform.Sampler], 0);

    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
