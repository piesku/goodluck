import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Entity} from "../../common/world.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform;

export function sys_transform(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            if (transform.Dirty) {
                update_transform(game, i, transform);
            }
        }
    }
}

function update_transform(game: Game, entity: Entity, transform: Transform) {
    transform.Dirty = false;

    if (game.XrFrame && game.World.Signature[entity] & Has.ControlXr) {
        // Pose transforms have their World matrix set from XRPose by other
        // systems. Their translation, rotation and scale are ignored.
    } else {
        from_rotation_translation_scale(
            transform.World,
            transform.Rotation,
            transform.Translation,
            transform.Scale
        );
    }

    if (transform.Parent !== undefined) {
        let parent_transform = game.World.Transform[transform.Parent];
        multiply(transform.World, parent_transform.World, transform.World);
    }

    invert(transform.Self, transform.World);

    if (game.World.Signature[entity] & Has.Children) {
        let children = game.World.Children[entity];
        for (let child of children.Children) {
            if (game.World.Signature[child] & Has.Transform) {
                let child_transform = game.World.Transform[child];
                child_transform.Parent = entity;
                update_transform(game, child, child_transform);
            }
        }
    }
}
