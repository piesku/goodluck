import {ease_in_out_sine} from "../../common/easing.js";
import {create_fly_camera} from "../blueprints/blu_fly_camera.js";
import {Anim, animate, AnimationClip} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {draw_marker} from "../components/com_draw.js";
import {light} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Cube} from "../shapes/Cube.js";
import {Icosphere} from "../shapes/Icosphere.js";
import {snd_music} from "../sounds/snd_music.js";
import {World} from "../world.js";

const anim_scale: AnimationClip = {
    Keyframes: [
        {
            Timestamp: 0,
            Scale: [1, 1, 1],
            Ease: ease_in_out_sine,
        },
        {
            Timestamp: 1,
            Scale: [0.8, 0.8, 0.8],
            Ease: ease_in_out_sine,
        },
    ],
};

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Player-controlled camera.
    game.Add({
        Translation: [0, 0, 5],
        ...create_fly_camera(game),
    });

    // Ground.
    game.Add({
        Translation: [0, -2, 0],
        Scale: [10, 1, 10],
        Using: [
            render_shaded(game.MaterialGouraud, Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    // Light and audio source.
    game.Add({
        Translation: [0, 3, 5],
        Using: [light([1, 1, 1], 5), audio_source(snd_music)],
    });

    game.Add({
        Translation: [-2, 5, 0],
        Using: [
            render_basic(game.MaterialPoints, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
        Children: [
            {
                Translation: [0, 1, 0],
                Using: [draw_marker("!")],
            },
        ],
    });

    game.Add({
        Translation: [0, 5, 0],
        Using: [
            render_basic(game.MaterialWireframe, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
    });

    game.Add({
        Translation: [2, 5, 0],
        Using: [
            render_basic(game.MaterialBasic, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
    });

    game.Add({
        Translation: [-2, 1, 0],
        Using: [
            render_shaded(game.MaterialFlat, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
    });

    game.Add({
        Translation: [0, 1, 0],
        Using: [
            render_shaded(game.MaterialGouraud, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
    });

    game.Add({
        Translation: [2, 1, 0],
        Using: [
            render_shaded(game.MaterialPhong, Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: anim_scale,
            }),
        ],
    });
}
