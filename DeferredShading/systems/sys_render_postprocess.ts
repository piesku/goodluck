/**
 * @module systems/sys_render_postprocess
 */

import {
    GL_CW,
    GL_DEPTH_TEST,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Game} from "../game.js";

export function sys_render_postprocess(game: Game, delta: number) {
    let mesh = game.MeshQuad;
    game.Gl.frontFace(GL_CW);
    game.Gl.bindVertexArray(mesh.Vao);
    // Allow rendering multiple quads on top of each other, in the same frame
    // and across multiple frames.
    game.Gl.disable(GL_DEPTH_TEST);

    {
        // Tone-mapping.
        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, game.Targets.Toned.Framebuffer);
        game.Gl.viewport(0, 0, game.Targets.Toned.Width, game.Targets.Toned.Height);

        let material = game.MaterialPostprocessTone;
        game.Gl.useProgram(material.Program);
        game.Gl.uniform2f(material.Locations.Viewport, game.ViewportWidth, game.ViewportHeight);

        game.Gl.activeTexture(GL_TEXTURE0);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Shaded.ColorTexture);
        game.Gl.uniform1i(material.Locations.Sampler, 0);

        game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    }

    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);

    {
        // FXAA
        let material = game.MaterialPostprocessFXAA;
        game.Gl.useProgram(material.Program);
        game.Gl.uniform2f(material.Locations.Viewport, game.ViewportWidth, game.ViewportHeight);

        game.Gl.activeTexture(GL_TEXTURE0);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Toned.ColorTexture);
        game.Gl.uniform1i(material.Locations.Sampler, 0);

        game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    }

    game.Gl.enable(GL_DEPTH_TEST);
    game.Gl.bindVertexArray(null);
}
