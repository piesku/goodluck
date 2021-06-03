import {Material} from "../../common/material.js";
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FRAMEBUFFER,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {ColoredShadedLayout} from "../../materials/layout_colored_shaded.js";
import {ForwardShadingLayout} from "../../materials/layout_forward_shading.js";
import {CameraEye, CameraForward, CameraKind} from "../components/com_camera.js";
import {Render, RenderColoredShadows, RenderKind} from "../components/com_render1.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {ShadowMappingLayout} from "../materials/layout_shadow_mapping.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform | Has.Render;

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;
    World: World & {
        Render: Array<Render>;
    };
}

export function sys_render_forward(game: Game1, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Forward:
                render_forward(game, camera);
                break;
        }
    }
}

function render_forward(game: Game1, camera: CameraForward) {
    game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    game.Gl.clearColor(...camera.ClearColor);
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    render(game, camera);
}

function render(game: Game1, eye: CameraEye) {
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
                    case RenderKind.ColoredShadows:
                        use_colored_shadows(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredShadows:
                    draw_colored_shadows(game, transform, render);
                    break;
            }
        }
    }
}

function use_colored_shadows(
    game: Game1,
    material: Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, game.Targets.Sun.DepthTexture);
    game.Gl.uniform1i(material.Locations.ShadowMap, 0);

    // TODO How to parameterize this?
    let light_entity = game.Cameras[1];
    let light_camera = game.World.Camera[light_entity];
    game.Gl.uniformMatrix4fv(material.Locations.ShadowSpace, false, light_camera.Pv);
}

function draw_colored_shadows(game: Game1, transform: Transform, render: RenderColoredShadows) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
    game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
    game.Gl.uniform1f(render.Material.Locations.Shininess, render.Shininess);
    game.ExtVao.bindVertexArrayOES(render.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.ExtVao.bindVertexArrayOES(null);
}
