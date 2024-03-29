import {instantiate} from "../../lib/game.js";
import {quat_from_euler} from "../../lib/quat.js";
import {set_seed} from "../../lib/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_character_rigged} from "../blueprints/blu_character_rigged.js";
import {blueprint_character_voxel} from "../blueprints/blu_character_voxel.js";
import {animate, AnimationFlag} from "../components/com_animate.js";
import {audio_listener} from "../components/com_audio_listener.js";
import {audio_source} from "../components/com_audio_source.js";
import {children} from "../components/com_children.js";
import {control} from "../components/com_control.js";
import {light_directional} from "../components/com_light.js";
import {set_position, set_rotation, set_scale, transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    set_seed(Date.now());

    // Camera.
    instantiate(game, [
        ...blueprint_camera(game),
        set_position(0, 0, 15),
        set_rotation(0, 180, 0),
        audio_listener(),
    ]);

    // Light 1.
    instantiate(game, [
        transform(undefined, quat_from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 0.5),
    ]);

    // Bottom light.
    instantiate(game, [
        transform(undefined, quat_from_euler([0, 0, 0, 1], 30, -60, 0)),
        light_directional([1, 1, 1], 0.2),
    ]);

    // Character carousel.
    instantiate(game, [
        transform(),
        animate({
            idle: {
                Keyframes: [
                    {
                        Timestamp: 0,
                        Rotation: [0, 0, 0, 1],
                    },
                    {
                        Timestamp: 3,
                        Rotation: [0, 1, 0, 0],
                    },
                    {
                        Timestamp: 6,
                        Rotation: [0, 0, 0, -1],
                    },
                ],
                Flags: AnimationFlag.Loop,
            },
        }),
        children(
            [
                ...blueprint_character_voxel(game),
                set_position(-7, 0, 0),
                control(),
                audio_source(true),
            ],
            [
                ...blueprint_character_rigged(game),
                set_position(7, -4, 0),
                set_rotation(0, 180, 0),
                set_scale(3, 3, 3),
                control(),
                audio_source(true),
            ],
        ),
    ]);
}
