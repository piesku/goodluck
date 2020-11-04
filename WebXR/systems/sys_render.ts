import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {ColoredDiffuseLayout} from "../../materials/layout_colored_diffuse.js";
import {CameraEye, CameraKind, CameraPerspective, CameraXr} from "../components/com_camera.js";
import {RenderColoredDiffuse, RenderKind} from "../components/com_render2.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

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
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    render(game, camera);
}

function render_vr(game: Game, camera: CameraXr) {
    let layer = game.XrFrame!.session.renderState.baseLayer!;
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, layer.framebuffer);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    for (let eye of camera.Eyes) {
        let viewport = layer.getViewport(eye.Viewpoint);
        game.Gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        render(game, eye);
    }
}

function render(game: Game, eye: CameraEye) {
    // Keep track of the current material to minimize switching.
    let current_material = null;
    let current_front_face = null;

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.ColoredDiffuse:
                        use_colored_diffuse(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredDiffuse:
                    draw_colored_diffuse(game, transform, render);
                    break;
            }
        }
    }
}

function use_colored_diffuse(game: Game, material: Material<ColoredDiffuseLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_colored_diffuse(game: Game, transform: Transform, render: RenderColoredDiffuse) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}
