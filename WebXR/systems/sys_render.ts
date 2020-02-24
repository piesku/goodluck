import {Mat4} from "../../common/math.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {CameraKind, CameraPerspective, CameraXr} from "../components/com_camera.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderShaded, ShadedUniform} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    let camera = game.Camera!;
    if (camera.Kind === CameraKind.Xr) {
        render_vr(game, camera);
    } else {
        render_screen(game, camera);
    }
}

function render_screen(game: Game, camera: CameraPerspective) {
    game.GL.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.GL.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    render(game, camera.PV);
}

function render_vr(game: Game, camera: CameraXr) {
    let layer = game.XrFrame!.session.renderState.baseLayer!;
    game.GL.bindFramebuffer(GL_FRAMEBUFFER, layer.framebuffer);
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    for (let eye of camera.Eyes) {
        let viewport = layer.getViewport(eye.View);
        game.GL.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        render(game, eye.Pv);
    }
}

function render(game: Game, pv: Mat4) {
    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;

                game.GL.useProgram(current_material.Program);
                // XXX Uniforms[0] should always be PV.
                game.GL.uniformMatrix4fv(current_material.Uniforms[0], false, pv);

                switch (render.Kind) {
                    case RenderKind.Shaded:
                        game.GL.uniform1i(
                            current_material.Uniforms[ShadedUniform.LightCount],
                            game.LightPositions.length / 3
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[ShadedUniform.LightPositions],
                            game.LightPositions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[ShadedUniform.LightDetails],
                            game.LightDetails
                        );
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Shaded:
                    draw_shaded(game, transform, render);
                    break;
            }
        }
    }
}

function draw_shaded(game: Game, transform: Transform, render: RenderShaded) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.World], false, transform.World);
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.Self], false, transform.Self);
    game.GL.uniform4fv(render.Material.Uniforms[ShadedUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
