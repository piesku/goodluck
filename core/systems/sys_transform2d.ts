/**
 * # sys_transform2d
 *
 * Apply changes to position, rotation, and scale, and update the instance array
 * to be used by the shader.
 *
 * An entity will be processed only if it's marked as **dirty** by another
 * system:
 *
 *     game.World.Signature[entity] |= Has.Dirty;
 *
 * A fast path for entities **without the `SpatialNode2D` component** skips the
 * computation of the `World` transformation matrix on the CPU. Instead, raw
 * position, rotation, and scale are stored in the instance array, and the
 * shader computes the transformation matrix from them. This is very fast and
 * can be used effectively for particles and background tiles.
 *
 * Entities **with the `SpatialNode2D` component** have their `World`
 * transformation matrix computed in the system, i.e. on the CPU. The `World`
 * matrices of their parents are taken into account. The data is stored in the
 * instance array implicitly, taking advantage of the fact that the `World`
 * property of the `SpatialNode2D` component is a view into the instance array
 * buffer.
 *
 * `sys_transform2d` doesn't depend on the order of entities in the world, but
 * it works best when parents are added before children. This is the default
 * insertion order of `instantiate()`, but because entities can be later
 * recycled, it's not guaranteed.
 *
 * `sys_transform2d` also updates the node's `Parent` field. When reparenting
 * entities, it's not necessary to assign the new parent manually. OTOH, the
 * `Parent` field should only be referenced after `sys_transform2d` has already
 * run during the frame.
 */

import {
    mat2d_compose,
    mat2d_get_translation,
    mat2d_invert,
    mat2d_multiply,
} from "../../lib/mat2d.js";
import {DEG_TO_RAD, Vec2} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
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
    game.World.InstanceData[instance_offset + 0] = local.Scale[0];
    game.World.InstanceData[instance_offset + 1] = local.Scale[1];
    game.World.InstanceData[instance_offset + 2] = local.Rotation * DEG_TO_RAD;
    game.World.InstanceData[instance_offset + 4] = local.Translation[0];
    game.World.InstanceData[instance_offset + 5] = local.Translation[1];
}

const world_position: Vec2 = [0, 0];

function update_spatial_node(game: Game, entity: Entity, parent?: Entity) {
    game.World.Signature[entity] &= ~Has.Dirty;

    let local = game.World.LocalTransform2D[entity];
    let node = game.World.SpatialNode2D[entity];

    mat2d_compose(node.World, local.Translation, local.Rotation * DEG_TO_RAD, local.Scale);

    if (parent !== undefined) {
        node.Parent = parent;
    }

    if (node.Parent !== undefined) {
        let parent_transform = game.World.SpatialNode2D[node.Parent];
        mat2d_multiply(node.World, parent_transform.World, node.World);

        if (node.IsGyroscope) {
            mat2d_get_translation(world_position, node.World);
            mat2d_compose(node.World, world_position, local.Rotation * DEG_TO_RAD, local.Scale);
        }
    }

    mat2d_invert(node.Self, node.World);

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
