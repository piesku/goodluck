import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_STREAM_DRAW,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
} from "../../common/webgl.js";
import {CameraForward, CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";

export function sys_render2d(game: Game, delta: number) {
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Forward:
                render_forward(game, camera);
                break;
        }
    }
}

function render_forward(game: Game, camera: CameraForward) {
    let material = game.MaterialInstanced;

    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, camera.Pv);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, game.Textures["checker1.png"]);
    game.Gl.uniform1i(material.Locations.SpriteSheet, 0);

    game.Gl.bindVertexArray(game.Vao);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, game.InstanceBuffer);
    // Creating a new buffer each frame seems to be ~25% faster than bufferSubData.
    game.Gl.bufferData(GL_ARRAY_BUFFER, game.InstanceData, GL_STREAM_DRAW);

    game.Gl.drawArraysInstanced(material.Mode, 0, 4, game.World.Signature.length);
    game.Gl.bindVertexArray(null);
}
