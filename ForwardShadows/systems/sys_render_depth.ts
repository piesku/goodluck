import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {CameraDepth, CameraKind} from "../components/com_camera.js";
import {Render, RenderKind, RenderVertices} from "../components/com_render.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_depth(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Depth:
                render_depth(game, camera);
                break;
        }
    }
}

function render_depth(game: Game, camera: CameraDepth) {
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

            switch (render.Kind) {
                case RenderKind.Vertices:
                    // Skip rendering, RenderVertices doesn't cast shadow for now.
                    continue;
                default:
                    draw_default(game, transform, render);
            }
        }
    }
}

function draw_default(game: Game, transform: Transform, render: Exclude<Render, RenderVertices>) {
    let material = game.MaterialDepth;

    // Pass uniforms at locations specific to MaterialDepth.
    game.Gl.uniformMatrix4fv(material.Locations.World, false, transform.World);

    // Pass attributes at locations specific to MaterialDepth.
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.Mesh.VertexBuffer);
    game.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
    game.Gl.vertexAttribPointer(material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);
    game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, render.Mesh.IndexBuffer);

    game.Gl.drawElements(material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
}
