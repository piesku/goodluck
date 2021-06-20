/**
 * @module systems/sys_audio_source
 */

import {AudioClipKind, play_buffer_clip, play_synth_clip} from "../../common/audio.js";
import {get_forward, get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.AudioSource | Has.Transform;

export function sys_audio_source(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let audio_source = game.World.AudioSource[entity];
    let transform = game.World.Transform[entity];

    if (audio_source.Current) {
        audio_source.Time += delta;
        if (audio_source.Time > audio_source.Current.Exit) {
            // This clip can now be exited from. Note: We might clear Current
            // before the clip actually ends, if Exit < duration. That's OK, as
            // we don't attempt to stop the current audio anyways.
            // TODO Schedule notes from Current progressively rather than all at once.
            audio_source.Current = undefined;
        } else if (audio_source.Panner) {
            update_panner(audio_source.Panner, transform);
        }
    }

    if (audio_source.Trigger && !audio_source.Current) {
        switch (audio_source.Trigger.Kind) {
            case AudioClipKind.Buffer:
                play_buffer_clip(game.Audio, audio_source.Panner, audio_source.Trigger);
                break;
            case AudioClipKind.Synth:
                play_synth_clip(game.Audio, audio_source.Panner, audio_source.Trigger);
                break;
        }

        audio_source.Current = audio_source.Trigger;
        audio_source.Time = 0;

        if (audio_source.Panner) {
            update_panner(audio_source.Panner, transform);
        }
    }

    // Audio triggers are only valid in the frame they're set; they don't stack
    // up. Otherwise sound effects would go out of sync with the game logic.
    // Reset the trigger to the default or undefined, regardless of whether it
    // triggered a new clip to play.
    audio_source.Trigger = audio_source.Idle;
}

const position: Vec3 = [0, 0, 0];
const forward: Vec3 = [0, 0, 0];

function update_panner(panner: PannerNode, transform: Transform) {
    get_translation(position, transform.World);
    get_forward(forward, transform.World);

    if (panner.positionX) {
        panner.positionX.value = position[0];
        panner.positionY.value = position[1];
        panner.positionZ.value = position[2];
        panner.orientationX.value = forward[0];
        panner.orientationY.value = forward[1];
        panner.orientationZ.value = forward[2];
    } else {
        // Firefox & Safari.
        panner.setPosition(...position);
        panner.setOrientation(...forward);
    }
}
