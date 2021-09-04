/**
 * @module systems/sys_render_postprocess
 */

import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_CW,
    GL_DEPTH_BUFFER_BIT,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Game} from "../game.js";

export function sys_render_postprocess(game: Game, delta: number) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    game.Gl.frontFace(GL_CW);

    let material = game.MaterialPostprocess;
    let mesh = game.MeshQuad;
    let target = game.Targets.Shaded;

    game.Gl.useProgram(material.Program);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.RenderTexture);
    game.Gl.uniform1i(material.Locations.Sampler, 0);
    game.Gl.uniform2f(material.Locations.ViewportSize, game.ViewportWidth, game.ViewportHeight);

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
    game.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
    game.Gl.vertexAttribPointer(material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
    game.Gl.enableVertexAttribArray(material.Locations.VertexTexcoord);
    game.Gl.vertexAttribPointer(material.Locations.VertexTexcoord, 2, GL_FLOAT, false, 0, 0);

    game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
}
