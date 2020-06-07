import {from_rotation_translation_scale, invert, multiply} from "../../common/mat4.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

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
        set_children_as_dirty(game, transform.Children);

        from_rotation_translation_scale(
            transform.World,
            transform.Rotation,
            transform.Translation,
            transform.Scale
        );

        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent].World;
            multiply(transform.World, parent, transform.World);
        }

        invert(transform.Self, transform.World);
    }
}

function set_children_as_dirty(game: Game, children: Array<Entity>) {
    for (let child of children) {
        let transform = game.World.Transform[child];
        transform.Dirty = true;
        set_children_as_dirty(game, transform.Children);
    }
}
