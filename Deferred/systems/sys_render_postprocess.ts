import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE1,
    GL_TEXTURE2,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Game} from "../game.js";

export function sys_render_postprocess(game: Game, delta: number) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(0, 0, 0, 1);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    let camera = game.Cameras[0];
    let material = game.MaterialPostprocessOutline;
    let mesh = game.MeshQuad;
    let target = game.Targets.Gbuffer;

    game.Gl.useProgram(material.Program);
    game.Gl.uniform2f(material.Locations.Dimensions, game.ViewportWidth, game.ViewportHeight);
    game.Gl.uniformMatrix4fv(material.Locations.EyeWorld, false, camera.World);
    game.Gl.uniformMatrix4fv(material.Locations.EyeUnprojection, false, camera.Unprojection);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightColors, game.LightColors);
    game.Gl.uniform4fv(material.Locations.LightDirections, game.LightDirections);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.RenderTexture);
    game.Gl.uniform1i(material.Locations.ColorMap, 0);

    game.Gl.activeTexture(GL_TEXTURE1);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.NormalsTexture);
    game.Gl.uniform1i(material.Locations.NormalMap, 1);

    game.Gl.activeTexture(GL_TEXTURE2);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.DepthTexture);
    game.Gl.uniform1i(material.Locations.DepthMap, 2);

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
    game.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
    game.Gl.vertexAttribPointer(material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
    game.Gl.enableVertexAttribArray(material.Locations.VertexTexcoord);
    game.Gl.vertexAttribPointer(material.Locations.VertexTexcoord, 2, GL_FLOAT, false, 0, 0);

    game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
}
