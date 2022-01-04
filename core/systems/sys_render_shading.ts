/**
 * @module systems/sys_render_shading
 */

import {TargetKind} from "../../common/framebuffer.js";
import {Mesh} from "../../common/mesh.js";
import {
    GL_ARRAY_BUFFER,
    GL_BLEND,
    GL_COLOR_BUFFER_BIT,
    GL_CW,
    GL_DEPTH_BUFFER_BIT,
    GL_DRAW_FRAMEBUFFER,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_NEAREST,
    GL_ONE,
    GL_READ_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE5,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Attribute, Output} from "../../materials/layout.js";
import {LightKind} from "../../materials/light.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Light | Has.Transform;

export function sys_render_shading(game: Game, delta: number) {
    game.Gl.bindFramebuffer(GL_READ_FRAMEBUFFER, game.Targets.Gbuffer.Framebuffer);
    game.Gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, game.Targets.Shaded.Framebuffer);
    game.Gl.blitFramebuffer(
        0,
        0,
        game.Targets.Gbuffer.Width,
        game.Targets.Gbuffer.Height,
        0,
        0,
        game.Targets.Shaded.Width,
        game.Targets.Shaded.Height,
        GL_DEPTH_BUFFER_BIT,
        GL_NEAREST
    );
    game.Gl.viewport(0, 0, game.Targets.Shaded.Width, game.Targets.Shaded.Height);
    game.Gl.clearColor(0, 0, 0, 1);
    game.Gl.clear(GL_COLOR_BUFFER_BIT);
    game.Gl.frontFace(GL_CW);
    game.Gl.blendFunc(GL_ONE, GL_ONE);
    game.Gl.enable(GL_BLEND);
    game.Gl.depthMask(false);

    let camera_entity = game.Cameras[0];
    let camera = game.World.Camera[camera_entity];
    if (camera.Kind === CameraKind.Xr) {
        throw new Error("Deferred shading not implemented for XR cameras.");
    }

    let material = game.MaterialShading;
    let target = game.Targets.Gbuffer;

    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, camera.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, camera.Position);

    game.Gl.activeTexture(GL_TEXTURE0 + Output.Diffuse);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.DiffuseTexture);
    game.Gl.uniform1i(material.Locations.DiffuseMap, Output.Diffuse);

    game.Gl.activeTexture(GL_TEXTURE0 + Output.Specular);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.SpecularTexture);
    game.Gl.uniform1i(material.Locations.SpecularMap, Output.Specular);

    game.Gl.activeTexture(GL_TEXTURE0 + Output.Position);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.PositionTexture);
    game.Gl.uniform1i(material.Locations.PositionMap, Output.Position);

    game.Gl.activeTexture(GL_TEXTURE0 + Output.Normal);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.NormalTexture);
    game.Gl.uniform1i(material.Locations.NormalMap, Output.Normal);

    game.Gl.activeTexture(GL_TEXTURE0 + Output.Depth);
    game.Gl.bindTexture(GL_TEXTURE_2D, target.DepthTexture);
    game.Gl.uniform1i(material.Locations.DepthMap, Output.Depth);

    let current_mesh: Mesh | undefined;
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform[ent];
            let light = game.World.Light[ent];

            let light_is_shadow_source: number;
            if (game.World.Signature[ent] & Has.Camera) {
                light_is_shadow_source = 1;
                let camera = game.World.Camera[ent];
                if (camera.Kind !== CameraKind.Target || camera.Target.Kind !== TargetKind.Depth) {
                    throw new Error("Only depth cameras can be shadow sources.");
                }

                game.Gl.uniformMatrix4fv(material.Locations.ShadowSpace, false, camera.Pv);
                game.Gl.activeTexture(GL_TEXTURE5);
                game.Gl.bindTexture(GL_TEXTURE_2D, camera.Target.DepthTexture);
                game.Gl.uniform1i(material.Locations.ShadowMap, 5);
            } else {
                light_is_shadow_source = 0;
            }

            game.Gl.uniformMatrix4fv(material.Locations.World, false, transform.World);
            game.Gl.uniform2i(material.Locations.LightKind, light.Kind, light_is_shadow_source);
            game.Gl.uniform4f(material.Locations.LightDetails, ...light.Color, light.Intensity);

            let mesh: Mesh;
            switch (light.Kind) {
                case LightKind.Ambient:
                case LightKind.Directional:
                    mesh = game.MeshQuad;
                    break;
                case LightKind.Point:
                    mesh = game.MeshSphereSmooth;
                    break;
            }

            if (current_mesh !== mesh) {
                current_mesh = mesh;
                game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
                game.Gl.enableVertexAttribArray(Attribute.Position);
                game.Gl.vertexAttribPointer(Attribute.Position, 3, GL_FLOAT, false, 0, 0);
                game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
            }

            game.Gl.drawElements(material.Mode, mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
        }
    }

    game.Gl.depthMask(true);
    game.Gl.disable(GL_BLEND);
}
