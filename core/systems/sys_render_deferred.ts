/**
 * @module systems/sys_render_deferred
 */

import {TargetKind} from "../../common/framebuffer.js";
import {GL_FRAMEBUFFER, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {Render, RenderKind} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_deferred(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        if (camera.Kind === CameraKind.Target) {
            if (camera.Target.Kind === TargetKind.Deferred) {
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
                game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
                game.Gl.clearColor(...camera.ClearColor);
                game.Gl.clear(camera.ClearMask);
                render_all(game, camera);
            }
        }
    }
}

function render_all(game: Game, eye: CameraEye) {
    // Keep track of the current material to minimize switching.
    let current_material = null;
    let current_front_face = null;

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
        case RenderKind.ColoredDeferred:
            game.Gl.useProgram(render.Material.Program);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
            break;
    }
}

function draw_entity(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let render = game.World.Render[entity];

    switch (render.Kind) {
        case RenderKind.ColoredDeferred:
            game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
            game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
            game.Gl.uniform3fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
            game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
            game.Gl.uniform1f(render.Material.Locations.Emission, render.Emission);

            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(
                render.Material.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
            break;
    }
}
