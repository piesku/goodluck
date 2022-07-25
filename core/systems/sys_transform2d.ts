/**
 * @module systems/sys_transform2d
 */

import {compose, get_translation, invert, multiply} from "../../common/mat2d.js";
import {DEG_TO_RAD, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_INSTANCE, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY_DIRTY = Has.Local2D | Has.Dirty;
const QUERY_TRANSFORM = Has.Local2D | Has.Transform2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY_DIRTY) === QUERY_DIRTY) {
            if (game.World.Signature[ent] & Has.Transform2D) {
                update_transform(game, ent);
            } else {
                update_instance(game, ent);
            }
        }
    }
}

function update_instance(game: Game, entity: Entity) {
    game.World.Signature[entity] &= ~Has.Dirty;

    let local = game.World.Local2D[entity];
    let instance_offset = entity * FLOATS_PER_INSTANCE;
    game.InstanceData[instance_offset + 0] = local.Scale[0];
    game.InstanceData[instance_offset + 1] = local.Scale[1];
    game.InstanceData[instance_offset + 2] = local.Rotation * DEG_TO_RAD;
    game.InstanceData[instance_offset + 4] = local.Translation[0];
    game.InstanceData[instance_offset + 5] = local.Translation[1];
}

const world_position: Vec2 = [0, 0];

function update_transform(game: Game, entity: Entity, parent?: Entity) {
    game.World.Signature[entity] &= ~Has.Dirty;

    let local = game.World.Local2D[entity];
    let transform = game.World.Transform2D[entity];

    compose(transform.World, local.Translation, local.Rotation * DEG_TO_RAD, local.Scale);

    if (parent !== undefined) {
        transform.Parent = parent;
    }

    if (transform.Parent !== undefined) {
        let parent_transform = game.World.Transform2D[transform.Parent];
        multiply(transform.World, parent_transform.World, transform.World);

        if (transform.Gyroscope) {
            get_translation(world_position, transform.World);
            compose(transform.World, world_position, local.Rotation * DEG_TO_RAD, local.Scale);
        }
    }

    invert(transform.Self, transform.World);

    if (game.World.Signature[entity] & Has.Children) {
        let children = game.World.Children[entity];
        for (let i = 0; i < children.Children.length; i++) {
            let child = children.Children[i];
            if ((game.World.Signature[child] & QUERY_TRANSFORM) === QUERY_TRANSFORM) {
                update_transform(game, child, entity);
            }
        }
    }
}
