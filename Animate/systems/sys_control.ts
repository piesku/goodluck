import {Animate} from "../components/com_animate.js";
import {query_all} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {snd_jump} from "../sounds/snd_jump.js";
import {snd_walk} from "../sounds/snd_walk.js";
import {Has} from "../world.js";

const QUERY = Has.Control | Has.AudioSource;

export function sys_control(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let audio = game.World.AudioSource[entity];
    let anim: Animate["Trigger"];

    if (game.InputState["Space"]) {
        anim = "jump";
        audio.Trigger = snd_jump;
    } else if (game.InputState["ArrowUp"]) {
        anim = "move";
        audio.Trigger = snd_walk;
    } else {
        anim = "idle";
    }

    for (let descendant of query_all(game.World, entity, Has.Animate)) {
        game.World.Animate[descendant].Trigger = anim;
    }
}
