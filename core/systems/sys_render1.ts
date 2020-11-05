import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FLOAT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {ColoredDiffuseLayout} from "../../materials/layout_colored_diffuse.js";
import {ColoredSpecularLayout} from "../../materials/layout_colored_specular.js";
import {ColoredUnlitLayout} from "../../materials/layout_colored_unlit.js";
import {TexturedDiffuseLayout} from "../../materials/layout_textured_diffuse.js";
import {TexturedUnlitLayout} from "../../materials/layout_textured_unlit.js";
import {CameraDisplay, CameraEye, CameraFramebuffer, CameraKind} from "../components/com_camera.js";
import {
    Render,
    RenderColoredDiffuse,
    RenderColoredSpecular,
    RenderColoredUnlit,
    RenderKind,
    RenderTexturedDiffuse,
    RenderTexturedUnlit,
    RenderVertices,
} from "../components/com_render1.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform | Has.Render;

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;
    World: World & {
        Render: Array<Render>;
    };
}

export function sys_render(game: Game1, delta: number) {
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

function render_display(game: Game1, camera: CameraDisplay) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
}

function render_framebuffer(game: Game1, camera: CameraFramebuffer) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, camera.Target);
    game.Gl.viewport(0, 0, camera.ViewportWidth, camera.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera, camera.RenderTexture);
}

function render(game: Game1, eye: CameraEye, current_target?: WebGLTexture) {
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
                    case RenderKind.ColoredUnlit:
                        use_colored_unlit(game, render.Material, eye);
                        break;
                    case RenderKind.ColoredDiffuse:
                        use_colored_diffuse(game, render.Material, eye);
                        break;
                    case RenderKind.ColoredSpecular:
                        use_colored_specular(game, render.Material, eye);
                        break;
                    case RenderKind.TexturedUnlit:
                        use_textured_unlit(game, render.Material, eye);
                        break;
                    case RenderKind.TexturedDiffuse:
                        use_textured_diffuse(game, render.Material, eye);
                        break;
                    case RenderKind.Vertices:
                        use_vertices(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredUnlit:
                    draw_colored_unlit(game, transform, render);
                    break;
                case RenderKind.ColoredDiffuse:
                    draw_colored_diffuse(game, transform, render);
                    break;
                case RenderKind.ColoredSpecular:
                    draw_colored_specular(game, transform, render);
                    break;
                case RenderKind.TexturedUnlit:
                    // Prevent feedback loop between the active render target
                    // and the texture being rendered.
                    if (render.Texture !== current_target) {
                        draw_textured_unlit(game, transform, render);
                    }
                    break;
                case RenderKind.TexturedDiffuse:
                    // Prevent feedback loop between the active render target
                    // and the texture being rendered.
                    if (render.Texture !== current_target) {
                        draw_textured_diffuse(game, transform, render);
                    }
                    break;
                case RenderKind.Vertices:
                    draw_vertices(game, transform, render);
                    break;
            }
        }
    }
}

function use_colored_unlit(game: Game1, material: Material<ColoredUnlitLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_colored_unlit(game: Game1, transform: Transform, render: RenderColoredUnlit) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}

function use_colored_diffuse(
    game: Game1,
    material: Material<ColoredDiffuseLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_colored_diffuse(game: Game1, transform: Transform, render: RenderColoredDiffuse) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}

function use_colored_specular(
    game: Game1,
    material: Material<ColoredSpecularLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_colored_specular(game: Game1, transform: Transform, render: RenderColoredSpecular) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.ColorDiffuse, render.ColorDiffuse);
    game.Gl.uniform4fv(render.Material.Locations.ColorSpecular, render.ColorSpecular);
    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);
    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}

function use_textured_unlit(game: Game1, material: Material<TexturedUnlitLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_textured_unlit(game: Game1, transform: Transform, render: RenderTexturedUnlit) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.Gl.uniform1i(render.Material.Locations.Sampler, 0);

    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);

    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}

function use_textured_diffuse(
    game: Game1,
    material: Material<TexturedDiffuseLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_textured_diffuse(game: Game1, transform: Transform, render: RenderTexturedDiffuse) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.Gl.uniform1i(render.Material.Locations.Sampler, 0);

    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);

    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}

function use_vertices(game: Game1, material: Material<ColoredUnlitLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_vertices(game: Game1, transform: Transform, render: RenderVertices) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniform4fv(render.Material.Locations.Color, render.Color);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.VertexBuffer);
    game.Gl.enableVertexAttribArray(render.Material.Locations.VertexPosition);
    game.Gl.vertexAttribPointer(render.Material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);
    game.Gl.drawArrays(render.Material.Mode, 0, render.IndexCount);
}
