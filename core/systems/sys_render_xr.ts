/**
 * @module systems/sys_render_xr
 */

import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_FRAMEBUFFER} from "../../common/webgl.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {render_all} from "./sys_render_forward.js";

export function sys_render_xr(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Xr:
                let layer = game.XrFrame!.session.renderState.baseLayer!;
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, layer.framebuffer);
                game.Gl.clearColor(...camera.ClearColor);
                game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

                for (let eye of camera.Eyes) {
                    let viewport = layer.getViewport(eye.Viewpoint);
                    game.Gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
                    render_all(game, eye);
                }
                break;
        }
    }
}
