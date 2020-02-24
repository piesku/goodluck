import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_DYNAMIC_DRAW,
    GL_FLOAT,
} from "../../common/webgl.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {
    ParticleAttribute,
    ParticleUniform,
    RenderParticles,
} from "../components/com_render_particles.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.GL.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;

                game.GL.useProgram(current_material.Program);
                // XXX Uniforms[0] should always be PV.
                game.GL.uniformMatrix4fv(current_material.Uniforms[0], false, game.Camera!.PV);
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

function draw_particles(game: Game, render: RenderParticles, emitter: EmitParticles) {
    game.GL.uniform4fv(
        render.Material.Uniforms[ParticleUniform.ColorSizeStart],
        render.ColorSizeStart
    );
    game.GL.uniform4fv(render.Material.Uniforms[ParticleUniform.ColorSizeEnd], render.ColorSizeEnd);
    game.GL.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    game.GL.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    game.GL.enableVertexAttribArray(ParticleAttribute.Origin);
    game.GL.vertexAttribPointer(ParticleAttribute.Origin, 4, GL_FLOAT, false, 4 * 4, 0);
    game.GL.drawArrays(render.Material.Mode, 0, emitter.Instances.length / 4);
}
