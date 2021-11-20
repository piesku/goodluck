/**
 * @module systems/sys_render_deferred
 */

import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {CameraDeferred, CameraEye, CameraKind} from "../components/com_camera.js";
import {RenderKind} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_deferred(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Deferred:
                render_deferred(game, camera);
                break;
        }
    }
}

function render_deferred(game: Game, camera: CameraDeferred) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
    game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
}

function render(game: Game, eye: CameraEye) {
    // Keep track of the current material to minimize switching.
    let current_material = null;
    let current_front_face = null;

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.ColoredDeferred:
                        game.Gl.useProgram(render.Material.Program);
                        game.Gl.uniformMatrix4fv(render.Material.Locations.Pv, false, eye.Pv);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredDeferred:
                    game.Gl.uniformMatrix4fv(
                        render.Material.Locations.World,
                        false,
                        transform.World
                    );
                    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
                    game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
                    game.Gl.uniform3fv(
                        render.Material.Locations.SpecularColor,
                        render.SpecularColor
                    );
                    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);

                    game.Gl.bindVertexArray(render.Vao);
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
    }
}
