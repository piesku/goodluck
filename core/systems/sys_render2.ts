import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {DiffuseLayout} from "../../materials/layout_diffuse.js";
import {SpecularLayout} from "../../materials/layout_specular.js";
import {TexturedLayout} from "../../materials/layout_textured.js";
import {CameraDisplay, CameraEye, CameraFramebuffer, CameraKind} from "../components/com_camera.js";
import {
    Render,
    RenderDiffuse,
    RenderKind,
    RenderSpecular,
    RenderTextured,
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

export function sys_render(game: Game2, delta: number) {
    for (let camera of game.Cameras) {
        switch (camera.Kind) {
            case CameraKind.Display:
                render_display(game, camera);
                break;
            case CameraKind.Framebuffer:
                render_framebuffer(game, camera);
                break;
        }
    }
}

function render_display(game: Game2, camera: CameraDisplay) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
}

function render_framebuffer(game: Game2, camera: CameraFramebuffer) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target);
    game.Gl.viewport(0, 0, camera.ViewportWidth, camera.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera, camera.RenderTexture);
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
                    case RenderKind.Diffuse:
                        use_diffuse(game, render.Material, eye);
                        break;
                    case RenderKind.Specular:
                        use_specular(game, render.Material, eye);
                        break;
                    case RenderKind.Textured:
                        use_textured(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Diffuse:
                    draw_diffuse(game, transform, render);
                    break;
                case RenderKind.Specular:
                    draw_specular(game, transform, render);
                    break;
                case RenderKind.Textured:
                    // Prevent feedback loop between the active render target
                    // and the texture being rendered.
                    if (render.Texture !== current_target) {
                        draw_textured(game, transform, render);
                    }
                    break;
            }
        }
    }
}

function use_diffuse(game: Game2, material: Material<DiffuseLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_diffuse(game: Game2, transform: Transform, render: RenderDiffuse) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}

function use_specular(game: Game2, material: Material<SpecularLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_specular(game: Game2, transform: Transform, render: RenderSpecular) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.ColorDiffuse, render.ColorDiffuse);
    game.Gl.uniform4fv(render.Material.Locations.ColorSpecular, render.ColorSpecular);
    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);
    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}

function use_textured(game: Game2, material: Material<TexturedLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_textured(game: Game2, transform: Transform, render: RenderTextured) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.Gl.uniform1i(render.Material.Locations.Sampler, 0);

    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}
