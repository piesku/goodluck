import {resize_render_target} from "../../common/framebuffer.js";
import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {CameraEye, CameraFramebuffer, CameraKind} from "../components/com_camera.js";
import {RenderColored, RenderKind} from "../components/com_render_deferred.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {DeferredColoredLayout} from "../materials/layout_deferred_colored.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_deferred(game: Game, delta: number) {
    if (game.ViewportResized) {
        resize_render_target(
            game.Gl,
            game.Targets.Gbuffer,
            game.ViewportWidth,
            game.ViewportHeight
        );
    }

    for (let camera of game.Cameras) {
        switch (camera.Kind) {
            case CameraKind.Framebuffer:
                render_framebuffer(game, camera);
                break;
        }
    }
}

function render_framebuffer(game: Game, camera: CameraFramebuffer) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
    game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
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
                    case RenderKind.DeferredColored:
                        use_colored_unlit(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.DeferredColored:
                    draw_colored_unlit(game, transform, render);
                    break;
            }
        }
    }
}

function use_colored_unlit(game: Game, material: Material<DeferredColoredLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_colored_unlit(game: Game, transform: Transform, render: RenderColored) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.ColorDiffuse, render.ColorDiffuse);
    game.Gl.uniform3fv(render.Material.Locations.ColorSpecular, render.ColorSpecular);
    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);

    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}
