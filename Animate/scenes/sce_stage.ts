import {set_seed} from "../../common/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_character} from "../blueprints/blu_character.js";
import {animate, AnimationFlag} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {control} from "../components/com_control.js";
import {light_directional} from "../components/com_light.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    set_seed(Date.now());

    // Camera.
    instantiate(game, {
        Translation: [0, 1, 15],
        ...blueprint_camera(game),
    });

    // Light 1.
    instantiate(game, {
        Translation: [2, 3, 5],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Light 2.
    instantiate(game, {
        Translation: [-5, -5, -5],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Character.
    instantiate(game, {
        Translation: [0, 1, 0],
        ...blueprint_character(game),
        Using: [
            control(),
            animate({
                idle: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                            Rotation: [0, 0, 0, 1],
                        },
                        {
                            Timestamp: 20,
                            Rotation: [0, 1, 0, 0],
                        },
                        {
                            Timestamp: 40,
                            Rotation: [0, 0, 0, -1],
                        },
                    ],
                    Flags: AnimationFlag.Loop,
                },
            }),
            audio_source(),
        ],
    });
}
