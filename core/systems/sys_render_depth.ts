/**
 * @module systems/sys_render_depth
 */

import {TargetKind} from "../../common/framebuffer.js";
import {GL_FRAMEBUFFER, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {RenderKind} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_depth(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        if (camera.Kind === CameraKind.Target) {
            if (camera.Target.Kind === TargetKind.Depth) {
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
    let material = game.MaterialDepth;
    let current_front_face: GLint | null = null;

    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform[ent];
            let render = game.World.Render[ent];

            switch (render.Kind) {
                case RenderKind.Vertices:
                case RenderKind.ParticlesColored:
                case RenderKind.ParticlesTextured:
                    // Skip rendering, no shadow for now.
                    continue;
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            // Pass uniforms at locations specific to MaterialDepth.
            game.Gl.uniformMatrix4fv(material.Locations.World, false, transform.World);

            game.Gl.bindVertexArray(render.Mesh.Vao);
            game.Gl.drawElements(material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
            game.Gl.bindVertexArray(null);
        }
    }
}
