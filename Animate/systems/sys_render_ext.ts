import {multiply} from "../../common/mat4.js";
import {Material} from "../../common/material.js";
import {GL_FRAMEBUFFER, GL_UNSIGNED_SHORT} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {ColoredShadedLayout, ForwardShadingLayout} from "../../materials/layout.js";
import {CameraEye, CameraKind} from "../components/com_camera.js";
import {query_down} from "../components/com_children.js";
import {
    RenderColoredShaded,
    RenderColoredSkinned,
    RenderKind,
} from "../components/com_render_ext.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Render;

export function sys_render_forward(game: Game, delta: number) {
    for (let camera_entity of game.Cameras) {
        let camera = game.World.Camera[camera_entity];
        switch (camera.Kind) {
            case CameraKind.Canvas:
                game.Gl.bindFramebuffer(GL_FRAMEBUFFER, null);
                game.Gl.viewport(0, 0, game.ViewportWidth, game.ViewportHeight);
                game.Gl.clearColor(...camera.ClearColor);
                game.Gl.clear(camera.ClearMask);
                render(game, camera);
                break;
        }
    }
}

function render(game: Game, eye: CameraEye) {
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
                    case RenderKind.ColoredShaded:
                        use_colored_shaded(game, render.Material, eye);
                        break;
                    case RenderKind.ColoredSkinned:
                        use_colored_skinned(game, render.Material, eye);
                        break;
                }
            }

            if (render.FrontFace !== current_front_face) {
                current_front_face = render.FrontFace;
                game.Gl.frontFace(render.FrontFace);
            }

            switch (render.Kind) {
                case RenderKind.ColoredShaded:
                    draw_colored_shaded(game, transform, render);
                    break;
                case RenderKind.ColoredSkinned:
                    draw_colored_skinned(game, i, transform, render);
                    break;
            }
        }
    }
}

function use_colored_shaded(
    game: Game,
    material: Material<ColoredShadedLayout & ForwardShadingLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

function draw_colored_shaded(game: Game, transform: Transform, render: RenderColoredShaded) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
    game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
    game.Gl.uniform4fv(render.Material.Locations.EmissiveColor, render.EmissiveColor);
    game.Gl.bindVertexArray(render.Mesh.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}

function use_colored_skinned(
    game: Game,
    material: Material<ColoredShadedLayout & ForwardShadingLayout>,
    eye: CameraEye
) {
    game.Gl.useProgram(material.Program);
    game.Gl.uniformMatrix4fv(material.Locations.Pv, false, eye.Pv);
    game.Gl.uniform3fv(material.Locations.Eye, eye.Position);
    game.Gl.uniform4fv(material.Locations.LightPositions, game.LightPositions);
    game.Gl.uniform4fv(material.Locations.LightDetails, game.LightDetails);
}

const bones = new Float32Array(16 * 6);
function draw_colored_skinned(
    game: Game,
    entity: Entity,
    transform: Transform,
    render: RenderColoredSkinned
) {
    game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
    game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);
    game.Gl.uniform4fv(render.Material.Locations.DiffuseColor, render.DiffuseColor);
    game.Gl.uniform4fv(render.Material.Locations.SpecularColor, render.SpecularColor);
    game.Gl.uniform4fv(render.Material.Locations.EmissiveColor, render.EmissiveColor);

    for (let bone_entity of query_down(game.World, entity, Has.Bone | Has.Transform)) {
        let bone_transform = game.World.Transform[bone_entity];
        let bone = game.World.Bone[bone_entity];
        let bone_view = bones.subarray(bone.Index * 16);
        multiply(bone_view, bone_transform.World, bone.InverseBindPose);
    }
    game.Gl.uniformMatrix4fv(render.Material.Locations.Bones, false, bones);

    game.Gl.bindVertexArray(render.Mesh.Vao);
    game.Gl.drawElements(render.Material.Mode, render.Mesh.IndexCount, GL_UNSIGNED_SHORT, 0);
    game.Gl.bindVertexArray(null);
}
