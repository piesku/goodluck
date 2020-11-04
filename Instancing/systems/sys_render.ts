import {Material} from "../../common/material.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {CameraDisplay, CameraEye, CameraKind} from "../components/com_camera.js";
import {RenderInstanced, RenderKind} from "../components/com_render.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {InstancedLayout} from "../materials/layout_instanced.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    for (let camera of game.Cameras) {
        switch (camera.Kind) {
            case CameraKind.Display:
                render_display(game, camera);
                break;
        }
    }
}

function render_display(game: Game, camera: CameraDisplay) {
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
                    case RenderKind.Instanced:
                        use_instanced(game, render.Material, camera);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Instanced:
                    draw_instanced(game, transform, render);
                    break;
            }
        }
    }
}

function use_instanced(game: Game, material: Material<InstancedLayout>, eye: CameraEye) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform3fv(render.Material.Locations.Palette, render.Palette);
    game.Gl.bindVertexArray(render.Vao);
    game.Gl.drawElementsInstanced(
        render.Material.Mode,
        render.Mesh.IndexCount,
        GL_UNSIGNED_SHORT,
        0,
        render.InstanceCount
    );
    game.Gl.bindVertexArray(null);
}
