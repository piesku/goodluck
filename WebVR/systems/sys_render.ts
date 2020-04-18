import {Material} from "../../common/material.js";
import {Mat4} from "../../common/math.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {DiffuseLayout} from "../../materials/layout_diffuse.js";
import {CameraKind, CameraPerspective, CameraVr} from "../components/com_camera.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderDiffuse} from "../components/com_render_diffuse.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    let camera = game.Camera!;
    if (camera.Kind === CameraKind.Vr) {
        render_vr(game, camera);
    } else {
        render_screen(game, camera);
    }

    if (game.VrDisplay?.isPresenting) {
        game.VrDisplay.submitFrame();
    }
}

function render_screen(game: Game, camera: CameraPerspective) {
    if (game.ViewportResized) {
        game.GL.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    render(game, camera.PV);
}

function render_vr(game: Game, camera: CameraVr) {
    game.GL.viewport(0, 0, game.ViewportWidth / 2, game.ViewportHeight);
    render(game, camera.PvLeft);
    game.GL.viewport(game.ViewportWidth / 2, 0, game.ViewportWidth / 2, game.ViewportHeight);
    render(game, camera.PvRight);
}

function render(game: Game, pv: Mat4) {
    // Keep track of the current material to minimize switching.
    let current_material = null;
    let current_front_face = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.Diffuse:
                        use_diffuse(game, render.Material, pv);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Diffuse:
                    draw_shaded(game, transform, render);
                    break;
            }
        }
    }
}

function use_diffuse(game: Game, material: Material<DiffuseLayout>, pv: Mat4) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Locations.Pv, false, pv);
    game.GL.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.GL.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_shaded(game: Game, transform: Transform, render: RenderDiffuse) {
    game.GL.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.GL.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.GL.uniform4fv(render.Material.Locations.Color, render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
}
