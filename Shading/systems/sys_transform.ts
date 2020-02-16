import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Has} from "../components/com_index.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";

const QUERY = Has.Transform;

export function sys_transform(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game.World.Transform[i]);
        }
    }
}

function update(transform: Transform) {
    if (transform.Dirty) {
        transform.Dirty = false;
        set_children_as_dirty(transform);

        from_rotation_translation_scale(
            transform.World,
            transform.Rotation,
            transform.Translation,
            transform.Scale
        );

        if (transform.Parent) {
            multiply(transform.World, transform.Parent.World, transform.World);
        }

        invert(transform.Self, transform.World);
    }
}

function set_children_as_dirty(transform: Transform) {
    for (let child of transform.Children) {
        child.Dirty = true;
        set_children_as_dirty(child);
    }
}
