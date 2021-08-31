import {Entity} from "../../common/world.js";
import {Animate} from "../components/com_animate.js";
import {query_down} from "../components/com_children.js";
import {Game} from "../game.js";
import {snd_jump} from "../sounds/snd_jump.js";
import {snd_walk} from "../sounds/snd_walk.js";
import {Has} from "../world.js";

const QUERY = Has.Control | Has.AudioSource;

export function sys_control(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
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
        anim = "walk";
        audio.Trigger = snd_walk;
    } else {
        anim = "idle";
    }

    for (let descendant of query_down(game.World, entity, Has.Animate)) {
        game.World.Animate[descendant].Trigger = anim;
    }
}
