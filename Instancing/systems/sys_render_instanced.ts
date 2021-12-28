/**
 * @module systems/sys_render_forward
 */
import {Material} from "../../common/material.js";
import {GL_ARRAY_BUFFER, GL_FLOAT, GL_FRAMEBUFFER, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {Render, RenderKind} from "../components/com_render_instanced.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_instanced(game: Game, delta: number) {
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
        }
    }
}

function render_all(game: Game, eye: CameraEye) {
    // Keep track of the current state to minimize switching.
    let current_material: Material<unknown> | null = null;
    let current_front_face: GLenum | null = null;

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let render = game.World.Render[ent];

            if (render.Material !== current_material) {
                current_material = render.Material;
                use_material(game, render, eye);
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            draw_entity(game, ent);
        }
    }
}

function use_material(game: Game, render: Render, eye: CameraEye) {
    switch (render.Kind) {
        case RenderKind.Instanced:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            game.Gl.uniform3fv(render.Material.Locations.Eye, eye.Position);
            game.Gl.uniform4fv(render.Material.Locations.FogColor, eye.FogColor);
            game.Gl.uniform1f(render.Material.Locations.FogDistance, eye.FogDistance);
            break;
    }
}

function draw_entity(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let render = game.World.Render[entity];

    switch (render.Kind) {
        case RenderKind.Instanced:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.bindVertexArray(render.Mesh.Vao);

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.InstanceTransforms);

            game.Gl.enableVertexAttribArray(render.Material.Locations.InstanceColumn1);
            game.Gl.vertexAttribDivisor(render.Material.Locations.InstanceColumn1, 1);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.InstanceColumn1,
                4,
                GL_FLOAT,
                false,
                4 * 16,
                0
            );

            game.Gl.enableVertexAttribArray(render.Material.Locations.InstanceColumn2);
            game.Gl.vertexAttribDivisor(render.Material.Locations.InstanceColumn2, 1);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.InstanceColumn2,
                4,
                GL_FLOAT,
                false,
                4 * 16,
                4 * 4
            );

            game.Gl.enableVertexAttribArray(render.Material.Locations.InstanceColumn3);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.InstanceColumn3,
                4,
                GL_FLOAT,
                false,
                4 * 16,
                4 * 8
            );
            game.Gl.vertexAttribDivisor(render.Material.Locations.InstanceColumn3, 1);

            game.Gl.enableVertexAttribArray(render.Material.Locations.InstanceColumn4);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.InstanceColumn4,
                4,
                GL_FLOAT,
                false,
                4 * 16,
                4 * 12
            );
            game.Gl.vertexAttribDivisor(render.Material.Locations.InstanceColumn4, 1);

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.InstanceColors);

            game.Gl.enableVertexAttribArray(render.Material.Locations.InstanceColor);
            game.Gl.vertexAttribDivisor(render.Material.Locations.InstanceColor, 1);
            game.Gl.vertexAttribPointer(
                render.Material.Locations.InstanceColor,
                3,
                GL_FLOAT,
                false,
                0,
                0
            );

            let instance_count = Math.floor(render.InstanceCount);
            game.Gl.drawElementsInstanced(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0,
                instance_count
            );
            game.Gl.bindVertexArray(null);
            break;
    }
}
