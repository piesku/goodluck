import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_DYNAMIC_DRAW,
    GL_FLOAT,
} from "../../common/webgl.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {RenderKind} from "../components/com_render.js";
import {RenderParticles} from "../components/com_render_particles.js";
import {Game} from "../game.js";
import {ParticlesLayout} from "../materials/layout_particles.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.Particles:
                        use_particles(game, render.Material);
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Particles: {
                    let emitter = game.World.EmitParticles[i];
                    if (emitter.Instances.length) {
                        draw_particles(game, render, emitter);
                    }
                    break;
                }
            }
        }
    }
}

function use_particles(game: Game, material: Material<ParticlesLayout>) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, game.Camera!.Pv);
}

function draw_particles(game: Game, render: RenderParticles, emitter: EmitParticles) {
    game.Gl.uniform4fv(render.Material.Locations.ColorSizeStart, render.ColorSizeStart);
    game.Gl.uniform4fv(render.Material.Locations.ColorSizeEnd, render.ColorSizeEnd);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    game.Gl.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    game.Gl.enableVertexAttribArray(render.Material.Locations.OriginAge);
    game.Gl.vertexAttribPointer(render.Material.Locations.OriginAge, 4, GL_FLOAT, false, 4 * 4, 0);
    game.Gl.drawArrays(render.Material.Mode, 0, emitter.Instances.length / 4);
}
