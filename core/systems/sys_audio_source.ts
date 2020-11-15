import {play_note} from "../../common/audio.js";
import {get_forward, get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.AudioSource;

export function sys_audio_source(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

let position: Vec3 = [0, 0, 0];
let forward: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let audio_source = game.World.AudioSource[entity];
    let can_exit = !audio_source.Current || audio_source.Time > audio_source.Current.Exit;

    if (audio_source.Panner) {
        let transform = game.World.Transform[entity];
        get_translation(position, transform.World);
        get_forward(forward, transform.World);

        audio_source.Panner.positionX.value = position[0];
        audio_source.Panner.positionY.value = position[1];
        audio_source.Panner.positionZ.value = position[2];
        audio_source.Panner.orientationX.value = forward[0];
        audio_source.Panner.orientationY.value = forward[1];
        audio_source.Panner.orientationZ.value = forward[2];
    }

    if (audio_source.Trigger && can_exit) {
        // Seconds per beat, corresponding to a quarter note.
        let spb = 60 / (audio_source.Trigger.BPM || 120);
        // Track timing is based on sixteenth notes.
        let interval = spb / 4;
        for (let track of audio_source.Trigger.Tracks) {
            for (let i = 0; i < track.Notes.length; i++) {
                if (track.Notes[i]) {
                    play_note(
                        game.Audio,
                        audio_source.Panner,
                        track.Instrument,
                        track.Notes[i],
                        i * interval
                    );
                }
            }
        }
        audio_source.Current = audio_source.Trigger;
        audio_source.Time = 0;
    } else {
        audio_source.Time += delta;
    }

    // Audio triggers are only valid in the frame they're set; they don't stack
    // up. Otherwise sound effects would go out of sync with the game logic.
    // Reset the trigger to the default or undefined, regardless of whether it
    // triggered a new clip to play.
    audio_source.Trigger = audio_source.Idle;
}
