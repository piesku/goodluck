/**
 * @module systems/sys_render2_forward
 */

import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {
    ColoredShadedLayout,
    ForwardShadingLayout,
    TexturedUnlitLayout,
} from "../../materials/layout.js";
import {CameraEye, CameraForward, CameraFramebuffer, CameraKind} from "../components/com_camera.js";
import {
    Render,
    RenderColoredShaded,
    RenderKind,
    RenderTexturedUnlit,
} from "../components/com_render2.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform | Has.Render;

interface Game2 extends Game {
    Gl: WebGL2RenderingContext;
    World: World & {
        Render: Array<Render>;
    };
}

export function sys_render_forward(game: Game2, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Forward:
                render_forward(game, camera);
                break;
            case CameraKind.Framebuffer:
                render_framebuffer(game, camera);
                break;
        }
    }
}

function render_forward(game: Game2, camera: CameraForward) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
}

function render_framebuffer(game: Game2, camera: CameraFramebuffer) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target.Framebuffer);
    game.Gl.viewport(0, 0, camera.Target.Width, camera.Target.Height);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera, camera.Target.RenderTexture);
}

function render(game: Game2, eye: CameraEye, current_target?: WebGLTexture) {
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
                    case RenderKind.ColoredShaded:
                        use_colored_shaded(game, render.Material, eye);
                        break;
                    case RenderKind.TexturedUnlit:
                        use_textured_unlit(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredShaded:
                    draw_colored_shaded(game, transform, render);
                    break;
                case RenderKind.TexturedUnlit:
                    // Prevent feedback loop between the active render target
                    // and the texture being rendered.
                    if (render.Texture !== current_target) {
                        draw_textured_unlit(game, transform, render);
                    }
                    break;
            }
        }
    }
}

function use_colored_shaded(
    game: Game2,
    material: Material<ColoredShadedLayout & ForwardShadingLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_colored_shaded(game: Game2, transform: Transform, render: RenderColoredShaded) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
    game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);
    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}

function use_textured_unlit(game: Game2, material: Material<TexturedUnlitLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_textured_unlit(game: Game2, transform: Transform, render: RenderTexturedUnlit) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.Gl.uniform1i(render.Material.Locations.TextureMap, 0);

    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);

    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}
