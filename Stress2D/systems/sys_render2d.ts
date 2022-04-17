import {
    GL_ARRAY_BUFFER,
    GL_FRAMEBUFFER,
    GL_STREAM_DRAW,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
} from "../../common/webgl.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {FLOATS_PER_INSTANCE, Game} from "../game.js";
import {Has} from "../world.js";

export function sys_render2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        let offset = i * FLOATS_PER_INSTANCE + 7;
        if (game.World.Signature[i] & Has.Render2D) {
            if (game.InstanceData[offset] == 0) {
                game.InstanceData[offset] = 1;
            }
        } else if (game.InstanceData[offset] == 1) {
            game.InstanceData[offset] = 0;
        }
    }

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
    let material = game.MaterialInstanced;
    let sheet = game.Spritesheets["spritesheet.png"];

    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, sheet.Texture);
    game.Gl.uniform1i(material.Locations.SheetTexture, 0);
    game.Gl.uniform2f(material.Locations.SheetSize, sheet.Width, sheet.Height);

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, game.InstanceBuffer);
    game.Gl.bufferData(GL_ARRAY_BUFFER, game.InstanceData, GL_STREAM_DRAW);

    game.Gl.drawArraysInstanced(material.Mode, 0, 4, game.World.Signature.length);
}
