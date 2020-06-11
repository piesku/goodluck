import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Transform} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform;

export function sys_transform(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    if (transform.Dirty) {
        transform.Dirty = false;
        set_children_as_dirty(game.World, transform);

        if (game.World.Mask[entity] & Has.Pose) {
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
    }
}

function set_children_as_dirty(world: World, transform: Transform) {
    for (let child of transform.Children) {
        let child_transform = world.Transform[child];
        child_transform.Dirty = true;
        set_children_as_dirty(world, child_transform);
    }
}
