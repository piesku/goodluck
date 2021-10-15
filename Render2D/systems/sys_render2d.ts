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
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render2D;

export function sys_render2d(game: Game, delta: number) {
    collect_instance_data(game);

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

    game.Gl.drawArraysInstanced(material.Mode, 0, 4, game.InstanceCount);
    game.Gl.bindVertexArray(null);
}

function collect_instance_data(game: Game) {
    let offset = 0;
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform[ent];
            let render = game.World.Render2D[ent];

            // Float32Array.set() is 3-4x slower than the following.
            game.InstanceData[offset++] = transform.World[0];
            game.InstanceData[offset++] = transform.World[1];
            game.InstanceData[offset++] = transform.World[2];
            game.InstanceData[offset++] = transform.World[3];
            game.InstanceData[offset++] = transform.World[4];
            game.InstanceData[offset++] = transform.World[5];
            game.InstanceData[offset++] = transform.World[6];
            game.InstanceData[offset++] = transform.World[7];
            game.InstanceData[offset++] = transform.World[8];
            game.InstanceData[offset++] = transform.World[9];
            game.InstanceData[offset++] = transform.World[10];
            game.InstanceData[offset++] = transform.World[11];
            game.InstanceData[offset++] = transform.World[12];
            game.InstanceData[offset++] = transform.World[13];
            game.InstanceData[offset++] = transform.World[14];
            game.InstanceData[offset++] = transform.World[15];

            game.InstanceData[offset++] = render.Color[0];
            game.InstanceData[offset++] = render.Color[1];
            game.InstanceData[offset++] = render.Color[2];
            game.InstanceData[offset++] = render.Color[3];
        }
    }
}
