/**
 * @module systems/sys_transform
 */

import {
    from_rotation_translation_scale,
    get_translation,
    invert,
    multiply,
} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform | Has.Dirty;

export function sys_transform(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let transform = game.World.Transform[ent];
            update_transform(game.World, ent, transform);
        }
    }
}

const world_position: Vec3 = [0, 0, 0];

function update_transform(world: World, entity: Entity, transform: Transform) {
    world.Signature[entity] &= ~Has.Dirty;

    from_rotation_translation_scale(
        transform.World,
        transform.Rotation,
        transform.Translation,
        transform.Scale
    );

    if (transform.Parent !== undefined) {
        let parent_transform = world.Transform[transform.Parent];
        multiply(transform.World, parent_transform.World, transform.World);

        if (transform.Gyroscope) {
            get_translation(world_position, transform.World);
            from_rotation_translation_scale(
                transform.World,
                transform.Rotation,
                world_position,
                transform.Scale
            );
        }
    }

    invert(transform.Self, transform.World);

    if (world.Signature[entity] & Has.Children) {
        let children = world.Children[entity];
        for (let i = 0; i < children.Children.length; i++) {
            let child = children.Children[i];
            if (world.Signature[child] & Has.Transform) {
                let child_transform = world.Transform[child];
                child_transform.Parent = entity;
                update_transform(world, child, child_transform);
            }
        }
    }
}
