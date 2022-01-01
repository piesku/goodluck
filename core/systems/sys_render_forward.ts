/**
 * @module systems/sys_render_forward
 */

import {TargetKind} from "../../common/framebuffer.js";
import {distance_squared_from_point} from "../../common/mat4.js";
import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_BLEND,
    GL_FLOAT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE1,
    GL_TEXTURE2,
    GL_TEXTURE3,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {Entity, first_having} from "../../common/world.js";
import {Attribute} from "../../materials/layout.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {FLOATS_PER_PARTICLE, Render, RenderKind, RenderPhase} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_forward(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Canvas:
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
                game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
                game.Gl.clearColor(...camera.ClearColor);
                game.Gl.clear(camera.ClearMask);
                render_all(game, camera);
                break;
            case CameraKind.Target:
                if (camera.Target.Kind === TargetKind.Forward) {
                    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
                    game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
                    game.Gl.clearColor(...camera.ClearColor);
                    game.Gl.clear(camera.ClearMask);
                    render_all(game, camera, camera.Target.ColorTexture);
                }
                break;
        }
    }
}

export function render_all(game: Game, eye: CameraEye, current_target?: WebGLTexture) {
    // Keep track of the current state to minimize switching.
    let current_material: Material<unknown> | null = null;
    let current_front_face: GLenum | null = null;

    // Transparent objects to be sorted by distance to camera and rendered later.
    let transparent_entities: Array<Entity> = [];

    // First render opaque objects.
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let render = game.World.Render[ent];

            if (render.Phase === RenderPhase.Transparent) {
                // Store transparent objects in a separate array to render them later.
                transparent_entities.push(ent);
                continue;
            }

            if (render.Material !== current_material) {
                current_material = render.Material;
                use_material(game, render, eye);
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            draw_entity(game, ent, current_target);
        }
    }

    // Sort transparent objects by distance to camera, from back to front, to
    // enforce overdraw and blend them in the correct order.
    transparent_entities.sort((a, b) => {
        let transform_a = game.World.Transform[a];
        let transform_b = game.World.Transform[b];
        return (
            distance_squared_from_point(transform_b.World, eye.Position) -
            distance_squared_from_point(transform_a.World, eye.Position)
        );
    });

    game.Gl.enable(GL_BLEND);

    for (let i = 0; i < transparent_entities.length; i++) {
        let ent = transparent_entities[i];
        let render = game.World.Render[ent];

        if (render.Material !== current_material) {
            current_material = render.Material;
            use_material(game, render, eye);
        }

        if (render.FrontFace !== current_front_face) {
            current_front_face = render.FrontFace;
            game.Gl.frontFace(render.FrontFace);
        }

        draw_entity(game, ent, current_target);
    }

    game.Gl.disable(GL_BLEND);
}

function use_material(game: Game, render: Render, eye: CameraEye) {
    switch (render.Kind) {
        case RenderKind.ColoredUnlit:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            break;
        case RenderKind.ColoredShaded:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            game.Gl.uniform3fv(render.Material.Locations.Eye, eye.Position);
            game.Gl.uniform4fv(render.Material.Locations.LightPositions, game.LightPositions);
            game.Gl.uniform4fv(render.Material.Locations.LightDetails, game.LightDetails);
            break;
        case RenderKind.ColoredShadows:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            game.Gl.uniform3fv(render.Material.Locations.Eye, eye.Position);
            game.Gl.uniform4fv(render.Material.Locations.LightPositions, game.LightPositions);
            game.Gl.uniform4fv(render.Material.Locations.LightDetails, game.LightDetails);

            game.Gl.activeTexture(GL_TEXTURE0);
            game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Sun.DepthTexture);
            game.Gl.uniform1i(render.Material.Locations.ShadowMap, 0);

            // Only one shadow source is supported.
            let light_entity = first_having(game.World, Has.Camera | Has.Light);
            if (light_entity) {
                let light_camera = game.World.Camera[light_entity];
                if (light_camera.Kind === CameraKind.Xr) {
                    throw new Error("XR cameras cannot be shadow sources.");
                }
                game.Gl.uniformMatrix4fv(
                    render.Material.Locations.ShadowSpace,
                    false,
                    light_camera.Pv
                );
            }
            break;
        case RenderKind.TexturedUnlit:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            break;
        case RenderKind.TexturedShaded:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            game.Gl.uniform3fv(render.Material.Locations.Eye, eye.Position);
            game.Gl.uniform4fv(render.Material.Locations.LightPositions, game.LightPositions);
            game.Gl.uniform4fv(render.Material.Locations.LightDetails, game.LightDetails);
            break;
        case RenderKind.MappedShaded:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            game.Gl.uniform3fv(render.Material.Locations.Eye, eye.Position);
            game.Gl.uniform4fv(render.Material.Locations.LightPositions, game.LightPositions);
            game.Gl.uniform4fv(render.Material.Locations.LightDetails, game.LightDetails);
            break;
        case RenderKind.Vertices:
        case RenderKind.ParticlesColored:
        case RenderKind.ParticlesTextured:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            break;
    }
}

function draw_entity(game: Game, entity: Entity, current_target?: WebGLTexture) {
    let transform = game.World.Transform[entity];
    let render = game.World.Render[entity];

    switch (render.Kind) {
        case RenderKind.ColoredUnlit:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);

            break;
        case RenderKind.ColoredShaded:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
            game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
            game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
            game.Gl.uniform4fv(render.Material.Locations.EmissiveColor, render.EmissiveColor);
            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
        case RenderKind.ColoredShadows:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
            game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
            game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
            game.Gl.uniform4fv(render.Material.Locations.EmissiveColor, render.EmissiveColor);
            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
        case RenderKind.TexturedUnlit:
            if (render.Texture === current_target) {
                // Prevent feedback loop between the active render target
                // and the texture being rendered.
                break;
            }

            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);

            game.Gl.activeTexture(GL_TEXTURE0);
            game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
            game.Gl.uniform1i(render.Material.Locations.TextureMap, 0);

            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
        case RenderKind.TexturedShaded:
            if (render.Texture === current_target) {
                // Prevent feedback loop between the active render target
                // and the texture being rendered.
                break;
            }

            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
            game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
            game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
            game.Gl.uniform4fv(render.Material.Locations.EmissiveColor, render.EmissiveColor);

            game.Gl.activeTexture(GL_TEXTURE0);
            game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
            game.Gl.uniform1i(render.Material.Locations.DiffuseMap, 0);

            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
        case RenderKind.MappedShaded:
            if (render.DiffuseMap === current_target) {
                // Prevent feedback loop between the active render target
                // and the texture being rendered.
                break;
            }
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);

            game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);

            game.Gl.activeTexture(GL_TEXTURE1);
            game.Gl.bindTexture(GL_TEXTURE_2D, render.DiffuseMap);
            game.Gl.uniform1i(render.Material.Locations.DiffuseMap, 1);

            game.Gl.activeTexture(GL_TEXTURE2);
            game.Gl.bindTexture(GL_TEXTURE_2D, render.NormalMap);
            game.Gl.uniform1i(render.Material.Locations.NormalMap, 2);

            game.Gl.activeTexture(GL_TEXTURE3);
            game.Gl.bindTexture(GL_TEXTURE_2D, render.RoughnessMap);
            game.Gl.uniform1i(render.Material.Locations.RoughnessMap, 3);

            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
        case RenderKind.Vertices:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.VertexBuffer);
            game.Gl.enableVertexAttribArray(Attribute.Position);
            game.Gl.vertexAttribPointer(Attribute.Position, 3, GL_FLOAT, false, 0, 0);
            game.Gl.drawArrays(render.Material.Mode, 0, render.IndexCount);
            break;
        case RenderKind.ParticlesColored: {
            let emitter = game.World.EmitParticles[entity];

            game.Gl.uniform4fv(render.Material.Locations.ColorStart, render.ColorStart);
            game.Gl.uniform4fv(render.Material.Locations.ColorEnd, render.ColorEnd);

            game.Gl.uniform4f(
                render.Material.Locations.Details,
                emitter.Lifespan,
                emitter.Speed,
                ...render.Size
            );

            let instances = Float32Array.from(emitter.Instances);
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
            game.Gl.bufferSubData(GL_ARRAY_BUFFER, 0, instances);

            game.Gl.enableVertexAttribArray(render.Material.Locations.OriginAge);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.OriginAge,
                4,
                GL_FLOAT,
                false,
                FLOATS_PER_PARTICLE * 4,
                0
            );

            game.Gl.enableVertexAttribArray(render.Material.Locations.Direction);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.Direction,
                3,
                GL_FLOAT,
                false,
                FLOATS_PER_PARTICLE * 4,
                4 * 4
            );
            game.Gl.drawArrays(
                render.Material.Mode,
                0,
                emitter.Instances.length / FLOATS_PER_PARTICLE
            );
            break;
        }
    }
}
