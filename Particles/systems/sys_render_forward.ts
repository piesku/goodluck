import {Material} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_FLOAT,
    GL_TEXTURE0,
    GL_TEXTURE_2D,
} from "../../common/webgl.js";
import {CameraEye} from "../components/com_camera.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {
    DATA_PER_PARTICLE,
    RenderKind,
    RenderParticlesColored,
    RenderParticlesTextured,
} from "../components/com_render.js";
import {Game} from "../game.js";
import {ParticlesColoredLayout, ParticlesTexturedLayout} from "../materials/layout_particles.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_forward(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    let camera = game.World.Camera[camera_entity];

    game.Gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (game.ViewportResized) {
        game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let render = game.World.Render[i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                switch (render.Kind) {
                    case RenderKind.ParticlesColored:
                        use_particles_colored(game, render.Material, camera);
                        break;
                    case RenderKind.ParticlesTextured:
                        use_particles_textured(game, render.Material, camera);
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.ParticlesColored: {
                    let emitter = game.World.EmitParticles[i];
                    if (emitter.Instances.length) {
                        draw_particles_colored(game, render, emitter);
                    }
                    break;
                }
                case RenderKind.ParticlesTextured: {
                    let emitter = game.World.EmitParticles[i];
                    if (emitter.Instances.length) {
                        draw_particles_textured(game, render, emitter);
                    }
                    break;
                }
            }
        }
    }
}

function use_particles_colored(
    game: Game,
    material: Material<ParticlesColoredLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_particles_colored(
    game: Game,
    render: RenderParticlesColored,
    emitter: EmitParticles
) {
    game.Gl.uniform4fv(render.Material.Locations.ColorStart, render.ColorStart);
    game.Gl.uniform4fv(render.Material.Locations.ColorEnd, render.ColorEnd);

    game.Gl.uniform4f(
        render.Material.Locations.Details,
        emitter.Lifespan,
        emitter.Speed,
        ...render.Size
    );

    let instances = Float32Array.from(emitter.Instances);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    game.Gl.bufferSubData(GL_ARRAY_BUFFER, 0, instances);

    game.Gl.enableVertexAttribArray(render.Material.Locations.OriginAge);
    game.Gl.vertexAttribPointer(
        render.Material.Locations.OriginAge,
        4,
        GL_FLOAT,
        false,
        DATA_PER_PARTICLE * 4,
        0
    );

    game.Gl.enableVertexAttribArray(render.Material.Locations.Direction);
    game.Gl.vertexAttribPointer(
        render.Material.Locations.Direction,
        3,
        GL_FLOAT,
        false,
        DATA_PER_PARTICLE * 4,
        4 * 4
    );
    game.Gl.drawArrays(render.Material.Mode, 0, emitter.Instances.length / DATA_PER_PARTICLE);
}

function use_particles_textured(
    game: Game,
    material: Material<ParticlesTexturedLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
}

function draw_particles_textured(
    game: Game,
    render: RenderParticlesTextured,
    emitter: EmitParticles
) {
    game.Gl.uniform4fv(render.Material.Locations.ColorStart, render.ColorStart);
    game.Gl.uniform4fv(render.Material.Locations.ColorEnd, render.ColorEnd);

    game.Gl.activeTexture(GL_TEXTURE0);
    game.Gl.bindTexture(GL_TEXTURE_2D, render.Texture);
    game.Gl.uniform1i(render.Material.Locations.TextureMap, 0);

    game.Gl.uniform4f(
        render.Material.Locations.Details,
        emitter.Lifespan,
        emitter.Speed,
        ...render.Size
    );

    let instances = Float32Array.from(emitter.Instances);
    game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    game.Gl.bufferSubData(GL_ARRAY_BUFFER, 0, instances);

    game.Gl.enableVertexAttribArray(render.Material.Locations.OriginAge);
    game.Gl.vertexAttribPointer(
        render.Material.Locations.OriginAge,
        4,
        GL_FLOAT,
        false,
        DATA_PER_PARTICLE * 4,
        0
    );
    game.Gl.enableVertexAttribArray(render.Material.Locations.DirectionSeed);
    game.Gl.vertexAttribPointer(
        render.Material.Locations.DirectionSeed,
        4,
        GL_FLOAT,
        false,
        DATA_PER_PARTICLE * 4,
        4 * 4
    );
    game.Gl.drawArrays(render.Material.Mode, 0, emitter.Instances.length / DATA_PER_PARTICLE);
}
