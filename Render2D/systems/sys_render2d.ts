import {GL_ARRAY_BUFFER, GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT} from "../../common/webgl.js";
import {CameraForward, CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render2D;

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

    let offset = 0;
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform[ent];
            let render = game.World.Render2D[ent];

            game.InstanceData.set(transform.World, 20 * offset);
            game.InstanceData.set(render.Color, 20 * offset + 16);
            offset++;
        }
    }

    game.Gl.bindVertexArray(game.Vao);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, game.InstanceBuffer);
    game.Gl.bufferSubData(GL_ARRAY_BUFFER, 0, game.InstanceData);

    game.Gl.drawArraysInstanced(material.Mode, 0, 4, 2);
    game.Gl.bindVertexArray(null);
}
