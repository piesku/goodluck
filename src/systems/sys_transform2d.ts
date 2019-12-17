import {Has} from "../components/com_index.js";
import {Transform2D} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {from_translation, invert, multiply, rotate, scale} from "../math/mat2d.js";

const QUERY = Has.Transform2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game.World.Transform2D[i]);
        }
    }
}

function update(transform: Transform2D) {
    if (transform.Dirty) {
        transform.Dirty = false;
        set_children_as_dirty(transform);

        from_translation(transform.World, transform.Translation);
        rotate(transform.World, transform.World, transform.Rotation);
        scale(transform.World, transform.World, transform.Scale);

        if (transform.Parent) {
            multiply(transform.World, transform.Parent.World, transform.World);
        }

        invert(transform.Self, transform.World);
    }
}

function set_children_as_dirty(transform: Transform2D) {
    for (let child of transform.Children) {
        child.Dirty = true;
        set_children_as_dirty(child);
    }
}
