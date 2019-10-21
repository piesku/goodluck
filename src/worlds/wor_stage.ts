import {ani_scale} from "../animations/ani_scale.js";
import {create_fly_camera} from "../blueprints/blu_fly_camera.js";
import {Anim, animate} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {draw_marker} from "../components/com_draw.js";
import {light} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";
import {Icosphere} from "../shapes/Icosphere.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_stage(game: Game) {
    game.World = [];
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
            render_shaded(game.Materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
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
            render_basic(game.Materials[Mat.Points], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
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
            render_basic(game.Materials[Mat.Wireframe], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
            }),
        ],
    });

    game.Add({
        Translation: [2, 5, 0],
        Using: [
            render_basic(game.Materials[Mat.Basic], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
            }),
        ],
    });

    game.Add({
        Translation: [-2, 1, 0],
        Using: [
            render_shaded(game.Materials[Mat.Flat], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
            }),
        ],
    });

    game.Add({
        Translation: [0, 1, 0],
        Using: [
            render_shaded(game.Materials[Mat.Gouraud], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
            }),
        ],
    });

    game.Add({
        Translation: [2, 1, 0],
        Using: [
            render_shaded(game.Materials[Mat.Phong], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                [Anim.Idle]: ani_scale,
            }),
        ],
    });
}
