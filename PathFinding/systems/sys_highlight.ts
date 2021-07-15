import {Vec4} from "../../common/math.js";
import {copy, scale} from "../../common/vec4.js";
import {Entity} from "../../common/world.js";
import {DrawKind} from "../components/com_draw.js";
import {PickableAABB, PickableKind} from "../components/com_pickable.js";
import {RenderKind} from "../components/com_render.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Pickable;

export function sys_highlight(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            let pickable = game.World.Pickable[i];
            switch (pickable.Kind) {
                case PickableKind.AABB: {
                    update_aabb(game, i, pickable);
                    break;
                }
            }
        }
    }
}

function update_aabb(game: Game, entity: Entity, pickable: PickableAABB) {
    let selectable = game.World.Selectable[entity];
    let children = game.World.Children[entity];

    let box_entity = children.Children[0];
    let box_draw = game.World.Draw[box_entity];
    if (box_draw.Kind !== DrawKind.Selection) {
        throw new Error("(sys_highlight) DrawKind not supported.");
    }

    let mesh_entity = children.Children[1];
    let mesh_render = game.World.Render[mesh_entity];

    let mesh_color: Vec4;
    switch (mesh_render.Kind) {
        case RenderKind.ColoredUnlit:
        case RenderKind.TexturedUnlit:
            mesh_color = mesh_render.Color;
            break;
        case RenderKind.ColoredShaded:
        case RenderKind.TexturedShaded:
        case RenderKind.MappedShaded:
            mesh_color = mesh_render.DiffuseColor;
            break;
        default:
            throw new Error("(sys_highlight) RenderKind not supported.");
    }

    if (game.Picked?.Entity === entity) {
        copy(mesh_color, pickable.Color);
        scale(mesh_color, mesh_color, 1.5);
    } else {
        copy(mesh_color, pickable.Color);
    }

    if (selectable.Selected) {
        game.World.Signature[box_entity] |= Has.Draw;
        box_draw.Size = 30 / game.CameraDolly;
    } else {
        game.World.Signature[box_entity] &= ~Has.Draw;
    }
}
