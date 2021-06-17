/**
 * @module systems/sys_render2_depth
 */

import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {DepthMappingLayout} from "../../materials/layout.js";
import {CameraDepth, CameraKind} from "../components/com_camera.js";
import {Render} from "../components/com_render2.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

interface Game2 extends Game {
    Gl: WebGL2RenderingContext;
    MaterialDepth: Material<DepthMappingLayout>;
    World: World & {
        Render: Array<Render>;
    };
}

const QUERY = Has.Transform | Has.Render;

export function sys_render_depth(game: Game2, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Depth:
                render_depth(game, camera);
                break;
        }
    }
}

function render_depth(game: Game2, camera: CameraDepth) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
    game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    game.Gl.useProgram(game.MaterialDepth.Program);
    game.Gl.uniformMatrix4fv(game.MaterialDepth.Locations.Pv, false, camera.Pv);

    let current_front_face = null;

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            game.Gl.uniformMatrix4fv(game.MaterialDepth.Locations.World, false, transform.World);
            game.Gl.bindVertexArray(render.Vao);
            game.Gl.drawElements(
                game.MaterialDepth.Mode,
                render.Mesh.IndexCount,
                GL_UNSIGNED_SHORT,
                0
            );
            game.Gl.bindVertexArray(null);
        }
    }
}
