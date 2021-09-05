/**
 * @module systems/sys_transform2d
 */

import {from_translation, invert, multiply, rotate, scale} from "../../common/mat2d.js";
import {Entity} from "../../common/world.js";
import {Transform2D} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform2D[i];
            if (transform.Dirty) {
                update_transform(game.World, i, transform);
            }
        }
    }
}

function update_transform(world: World, entity: Entity, transform: Transform2D) {
    transform.Dirty = false;

    from_translation(transform.World, transform.Translation);
    rotate(transform.World, transform.World, transform.Rotation);
    scale(transform.World, transform.World, transform.Scale);

    if (transform.Parent !== undefined) {
        let parent_transform = world.Transform2D[transform.Parent];
        multiply(transform.World, parent_transform.World, transform.World);
    }

    invert(transform.Self, transform.World);

    if (world.Signature[entity] & Has.Children) {
        let children = world.Children[entity];
        for (let i = 0; i < children.Children.length; i++) {
            let child = children.Children[i];
            if (world.Signature[child] & Has.Transform2D) {
                let child_transform = world.Transform2D[child];
                child_transform.Parent = entity;
                update_transform(world, child, child_transform);
            }
        }
    }
}
