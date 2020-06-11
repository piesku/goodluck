import {from_translation, invert, multiply, rotate, scale} from "../../common/mat2d.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D;

export function sys_transform2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform2D[entity];
    if (transform.Dirty) {
        transform.Dirty = false;
        set_children_as_dirty(game, transform.Children);

        from_translation(transform.World, transform.Translation);
        rotate(transform.World, transform.World, transform.Rotation);
        scale(transform.World, transform.World, transform.Scale);

        if (transform.Parent !== undefined) {
            let parent = game.World.Transform2D[transform.Parent].World;
            multiply(transform.World, parent, transform.World);
        }

        invert(transform.Self, transform.World);
    }
}

function set_children_as_dirty(game: Game, children: Array<Entity>) {
    for (let child of children) {
        let transform = game.World.Transform2D[child];
        transform.Dirty = true;
        set_children_as_dirty(game, transform.Children);
    }
}
