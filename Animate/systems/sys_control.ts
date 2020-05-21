import {Animate} from "../components/com_animate.js";
import {Has} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Control;

export function sys_control(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let trigger: Animate["Trigger"];

    if (game.InputState["Space"]) {
        trigger = "jump";
    } else if (game.InputState["ArrowUp"]) {
        trigger = "move";
    } else {
        trigger = "idle";
    }

    for (let animate of components_of_type<Animate>(
        game.World,
        transform,
        game.World.Animate,
        Has.Animate
    )) {
        animate.Trigger = trigger;
    }
}
