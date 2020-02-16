import {get_translation} from "../../common/mat4.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_DYNAMIC_DRAW,
    GL_FLOAT,
    GL_UNSIGNED_SHORT,
} from "../../common/webgl.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {Has} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {
    ParticleAttribute,
    ParticleUniform,
    RenderParticles,
} from "../components/com_render_particles.js";
import {RenderShaded, ShadedUniform} from "../components/com_render_shaded.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.Lights.length; i++) {
        let light = game.Lights[i];
        let transform = game.World.Transform[light.EntityId];
        let position = get_translation([0, 0, 0], transform.World);
        light_positions.push(...position);
        light_details.push(...light.Color, light.Intensity);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;

                game.GL.useProgram(current_material.Program);
                // XXX Uniforms[0] should always be PV.
                game.GL.uniformMatrix4fv(current_material.Uniforms[0], false, game.Cameras[0].PV);

                switch (render.Kind) {
                    case RenderKind.Shaded:
                        game.GL.uniform1i(
                            current_material.Uniforms[ShadedUniform.LightCount],
                            game.Lights.length
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[ShadedUniform.LightPositions],
                            light_positions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[ShadedUniform.LightDetails],
                            light_details
                        );
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Shaded:
                    draw_shaded(game, transform, render);
                    break;
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

function draw_shaded(game: Game, transform: Transform, render: RenderShaded) {
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.World], false, transform.World);
    game.GL.uniformMatrix4fv(render.Material.Uniforms[ShadedUniform.Self], false, transform.Self);
    game.GL.uniform4fv(render.Material.Uniforms[ShadedUniform.Color], render.Color);
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElements(render.Material.Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    game.GL.bindVertexArray(null);
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
