import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform;

export function sys_transform(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            if (transform.Dirty) {
                update_transform(game.World, transform);
            }
        }
    }
}

function update_transform(world: World, transform: Transform) {
    transform.Dirty = false;

    from_rotation_translation_scale(
        transform.World,
        transform.Rotation,
        transform.Translation,
        transform.Scale
    );

    if (transform.Parent !== undefined) {
        let parent = world.Transform[transform.Parent].World;
        multiply(transform.World, parent, transform.World);
    }

    invert(transform.Self, transform.World);

    for (let child of transform.Children) {
        let child_transform = world.Transform[child];
        update_transform(world, child_transform);
    }
}
