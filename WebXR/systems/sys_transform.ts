import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform;

export function sys_transform(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            if (transform.Dirty) {
                update(game, i);
            }
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
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
        let parent = game.World.Transform[transform.Parent].World;
        multiply(transform.World, parent, transform.World);
    }

    invert(transform.Self, transform.World);

    for (let child of transform.Children) {
        update(game, child);
    }
}
