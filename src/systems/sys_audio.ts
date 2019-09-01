import {play_note} from "../audio.js";
import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = 1 << Get.AudioSource;

export function sys_audio(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let audio_source = game[Get.AudioSource][entity];
    let can_exit = !audio_source.current || audio_source.time > audio_source.current.exit;

    if (audio_source.trigger && can_exit) {
        // Seconds per beat, corresponding to a quarter note.
        let spb = 60 / (audio_source.trigger.bpm || 120);
        // Track timing is based on sixteenth notes.
        let interval = spb / 4;
        for (let track of audio_source.trigger.tracks) {
            for (let i = 0; i < track.notes.length; i++) {
                if (track.notes[i]) {
                    play_note(game.audio, track.instrument, track.notes[i], i * interval);
                }
            }
        }
        audio_source.current = audio_source.trigger;
        audio_source.time = 0;
    } else {
        audio_source.time += delta;
    }

    // Audio triggers are only valid in the frame they're set; they don't stack
    // up. Otherwise sound effects would go out of sync with the game logic.
    // Reset the trigger to the default or undefined, regardless of whether it
    // triggered a new clip to play.
    audio_source.trigger = audio_source.idle;
}
