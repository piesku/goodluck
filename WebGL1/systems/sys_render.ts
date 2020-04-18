import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {DiffuseLayout} from "../../materials/layout_diffuse.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderDiffuse} from "../components/com_render_diffuse.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.GL.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

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
                        use_diffuse(game, render.Material);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.GL.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.Diffuse:
                    draw_diffuse(game, transform, render);
                    break;
            }
        }
    }
}

function use_diffuse(game: Game, material: Material<DiffuseLayout>) {
    game.GL.useProgram(material.Program);
    game.GL.uniformMatrix4fv(material.Locations.Pv, false, game.Camera!.PV);
    game.GL.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.GL.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_diffuse(game: Game, transform: Transform, render: RenderDiffuse) {
    game.GL.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.GL.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.GL.uniform4fv(render.Material.Locations.Color, render.Color);

    game.GL.bindBuffer(GL_ARRAY_BUFFER, render.Mesh.VertexBuffer);
    game.GL.enableVertexAttribArray(render.Material.Locations.VertexPosition);
    game.GL.vertexAttribPointer(render.Material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);

    game.GL.bindBuffer(GL_ARRAY_BUFFER, render.Mesh.NormalBuffer);
    game.GL.enableVertexAttribArray(render.Material.Locations.VertexNormal);
    game.GL.vertexAttribPointer(render.Material.Locations.VertexNormal, 3, GL_FLOAT, false, 0, 0);

    game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, render.Mesh.IndexBuffer);
    game.GL.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
}
