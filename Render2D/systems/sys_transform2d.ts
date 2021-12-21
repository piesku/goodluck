/**
 * @module systems/sys_transform2d
 */

import {compose, get_translation, invert, multiply} from "../../common/mat2d.js";
import {DEG_TO_RAD, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Transform2D} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform2D | Has.Dirty;

export function sys_transform2d(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform2D[ent];
            update_transform(game.World, ent, transform);
        }
    }
}

const world_position: Vec2 = [0, 0];

function update_transform(world: World, entity: Entity, transform: Transform2D) {
    world.Signature[entity] &= ~Has.Dirty;

    compose(
        transform.World,
        transform.Translation,
        transform.Rotation * DEG_TO_RAD,
        transform.Scale
    );

    if (transform.Parent !== undefined) {
        let parent_transform = world.Transform2D[transform.Parent];
        multiply(transform.World, parent_transform.World, transform.World);

        if (transform.Gyroscope) {
            get_translation(world_position, transform.World);
            compose(
                transform.World,
                world_position,
                transform.Rotation * DEG_TO_RAD,
                transform.Scale
            );
        }
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
