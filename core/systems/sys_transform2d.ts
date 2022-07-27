/**
 * @module systems/sys_transform2d
 */

import {compose, get_translation, invert, multiply} from "../../common/mat2d.js";
import {DEG_TO_RAD, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY_DIRTY = Has.LocalTransform2D | Has.Dirty;
const QUERY_NODE = Has.LocalTransform2D | Has.SpatialNode2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY_DIRTY) === QUERY_DIRTY) {
            if (game.World.Signature[ent] & Has.SpatialNode2D) {
                update_spatial_node(game, ent);
            } else {
                // Fast path for top-level transforms which aren't scene graph
                // nodes (they can't be parents nor children).
                update_instance_data(game, ent);
            }
        }
    }
}

// Write translation, rotation, and scale directly into the instance data
// buffer. The model matrix will be computed from them in the shader.
function update_instance_data(game: Game, entity: Entity) {
    game.World.Signature[entity] &= ~Has.Dirty;

    let local = game.World.LocalTransform2D[entity];
    let instance_offset = entity * FLOATS_PER_INSTANCE;
    game.InstanceData[instance_offset + 0] = local.Scale[0];
    game.InstanceData[instance_offset + 1] = local.Scale[1];
    game.InstanceData[instance_offset + 2] = local.Rotation * DEG_TO_RAD;
    game.InstanceData[instance_offset + 4] = local.Translation[0];
    game.InstanceData[instance_offset + 5] = local.Translation[1];
}

const world_position: Vec2 = [0, 0];

function update_spatial_node(game: Game, entity: Entity, parent?: Entity) {
    game.World.Signature[entity] &= ~Has.Dirty;

    let local = game.World.LocalTransform2D[entity];
    let node = game.World.SpatialNode2D[entity];

    compose(node.World, local.Translation, local.Rotation * DEG_TO_RAD, local.Scale);

    if (parent !== undefined) {
        node.Parent = parent;
    }

    if (node.Parent !== undefined) {
        let parent_transform = game.World.SpatialNode2D[node.Parent];
        multiply(node.World, parent_transform.World, node.World);

        if (node.Gyroscope) {
            get_translation(world_position, node.World);
            compose(node.World, world_position, local.Rotation * DEG_TO_RAD, local.Scale);
        }
    }

    invert(node.Self, node.World);

    if (game.World.Signature[entity] & Has.Children) {
        let children = game.World.Children[entity];
        for (let i = 0; i < children.Children.length; i++) {
            let child = children.Children[i];
            if ((game.World.Signature[child] & QUERY_NODE) === QUERY_NODE) {
                update_spatial_node(game, child, entity);
            }
        }
    }
}
