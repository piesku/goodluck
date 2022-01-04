/**
 * @module systems/sys_render_postprocess
 */

import {
    GL_CW,
    GL_DEPTH_TEST,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE1,
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

    game.Gl.clearColor(0, 0, 0, 1);

    {
        // Detect bright areas.
        let material = game.MaterialPostprocessBrightness;
        game.Gl.useProgram(material.Program);

        let target = game.Targets.Brightness;
        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
        game.Gl.viewport(0, 0, target.Width, target.Height);
        game.Gl.uniform2f(material.Locations.Viewport, target.Width, target.Height);

        game.Gl.uniform1i(material.Locations.Sampler, 0);
        game.Gl.activeTexture(GL_TEXTURE0);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Shaded.ColorTexture);

        game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    }

    {
        // Bloom.
        let material = game.MaterialPostprocessBlur;
        game.Gl.useProgram(material.Program);

        game.Gl.uniform1i(material.Locations.Sampler, 0);
        game.Gl.activeTexture(GL_TEXTURE0);

        let passes = 6;
        for (let i = 0; i < passes; i++) {
            let is_ping = i % 2 == 0;
            game.Gl.uniform1i(material.Locations.Horizontal, is_ping ? 1 : 0);
            if (is_ping) {
                let target = game.Targets.Ping;
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
                game.Gl.viewport(0, 0, target.Width, target.Height);
                game.Gl.uniform2f(material.Locations.Viewport, target.Width, target.Height);
                if (i == 0) {
                    game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Brightness.ColorTexture);
                } else {
                    game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Pong.ColorTexture);
                }
            } else {
                let target = game.Targets.Pong;
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
                game.Gl.viewport(0, 0, target.Width, target.Height);
                game.Gl.uniform2f(material.Locations.Viewport, target.Width, target.Height);
                game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Ping.ColorTexture);
            }

            game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
        }
    }

    {
        // Tone-mapping.
        let material = game.MaterialPostprocessTone;
        game.Gl.useProgram(material.Program);

        let target = game.Targets.Toned;
        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
        game.Gl.viewport(0, 0, target.Width, target.Height);
        game.Gl.uniform2f(material.Locations.Viewport, target.Width, target.Height);

        game.Gl.uniform1i(material.Locations.Sampler, 0);
        game.Gl.activeTexture(GL_TEXTURE0);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Shaded.ColorTexture);

        game.Gl.uniform1i(material.Locations.Bloom, 1);
        game.Gl.activeTexture(GL_TEXTURE1);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Pong.ColorTexture);

        game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    }

    {
        // Anti-aliasing.
        let material = game.MaterialPostprocessFXAA;
        game.Gl.useProgram(material.Program);

        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
        game.Gl.uniform2f(material.Locations.Viewport, game.ViewportWidth, game.ViewportHeight);

        game.Gl.activeTexture(GL_TEXTURE0);
        game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Toned.ColorTexture);
        game.Gl.uniform1i(material.Locations.Sampler, 0);

        game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    }

    game.Gl.enable(GL_DEPTH_TEST);
    game.Gl.bindVertexArray(null);
}
