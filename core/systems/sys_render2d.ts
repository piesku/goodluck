/**
 * # sys_render2d
 *
 * Render all sprites in the world using the WebGL renderer.
 *
 * Sprites are rendered on instanced quads, which means that they are all
 * rendered in a single draw call.
 */

import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_STREAM_DRAW,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
} from "../../lib/webgl.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {Camera2D} from "../components/com_camera2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export function sys_render2d(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        // The shader queries the instance data for presence of the following components.
        let signature = game.World.Signature[ent] & (Has.Render2D | Has.SpatialNode2D);
        let offset = ent * FLOATS_PER_INSTANCE + 7;
        if (game.World.InstanceData[offset] !== signature) {
            game.World.InstanceData[offset] = signature;
        }
    }

    game.Gl.bindBuffer(GL_ARRAY_BUFFER, game.InstanceBuffer);
    game.Gl.bufferData(GL_ARRAY_BUFFER, game.World.InstanceData, GL_STREAM_DRAW);

    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera2D[camera_entity];
        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
        game.Gl.viewport(0, 0, camera.ViewportWidth, camera.ViewportHeight);
        game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        render_all(game, camera);
        break;
    }
}

function render_all(game: Game, eye: Camera2D) {
    let material = game.MaterialRender2D;
    let sheet = game.Spritesheet;

    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix3x2fv(material.Locations.Pv, false, eye.Pv);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, sheet.Texture);
    game.Gl.uniform1i(material.Locations.SheetTexture, 0);
    game.Gl.uniform2f(material.Locations.SheetSize, sheet.Width, sheet.Height);

    game.Gl.drawArraysInstanced(material.Mode, 0, 4, game.World.Signature.length);
}
