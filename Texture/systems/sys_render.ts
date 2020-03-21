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
import {RenderTexture, TextureUniform} from "../components/com_render_texture.js";
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
                    case RenderKind.Texture:
                        use_diffuse(game, current_material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Texture:
                    draw_diffuse(game, transform, render);
                    break;
            }
        }
    }
}

function use_diffuse(game: Game, material: Material) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Uniforms[TextureUniform.PV], false, game.Camera!.PV);
    game.GL.uniform4fv(material.Uniforms[TextureUniform.LightPositions], game.LightPositions);
    game.GL.uniform4fv(material.Uniforms[TextureUniform.LightDetails], game.LightDetails);
}

function draw_diffuse(game: Game, transform: Transform, render: RenderTexture) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[TextureUniform.World],
        false,
        transform.World
    );

    game.GL.activeTexture(GL_TEXTURE0);
    // debugger;
    game.GL.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.GL.uniform1i(render.Material.Uniforms[TextureUniform.Sampler], 0);

    game.GL.uniformMatrix4fv(render.Material.Uniforms[TextureUniform.Self], false, transform.Self);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
