import {from_translation, invert, multiply, rotate, scale} from "../../common/mat2d.js";
import {Transform2D} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Transform2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform2D[i];
            if (transform.Dirty) {
                update_transform(game.World, transform);
            }
        }
    }
}

function update_transform(world: World, transform: Transform2D) {
    transform.Dirty = false;

    from_translation(transform.World, transform.Translation);
    rotate(transform.World, transform.World, transform.Rotation);
    scale(transform.World, transform.World, transform.Scale);

    if (transform.Parent !== undefined) {
        let parent = world.Transform2D[transform.Parent].World;
        multiply(transform.World, parent, transform.World);
    }

    invert(transform.Self, transform.World);

    for (let child of transform.Children) {
        let child_transform = world.Transform2D[child];
        update_transform(world, child_transform);
    }
}
