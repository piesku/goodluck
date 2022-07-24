import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface AnimateSprite {
    Frames: Record<string, number>;
    Duration: number;
    Time: number;
}

export function animate_sprite(frames: Record<string, number>) {
    let duration = 0;
    for (let frame_name in frames) {
        let frame_duration = frames[frame_name];
        duration = frames[frame_name] = duration + frame_duration;
    }

    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.AnimateSprite;
        game.World.AnimateSprite[entity] = {
            Frames: frames,
            Duration: duration,
            Time: 0,
        };
    };
}
