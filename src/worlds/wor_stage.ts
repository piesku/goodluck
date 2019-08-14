import {ani_scale} from "../animations/ani_scale.js";
import {fly_camera_blueprint} from "../blueprints/blu_fly_camera.js";
import {animate} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
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
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Player-controlled camera.
    game.add({
        translation: [0, 0, 5],
        ...fly_camera_blueprint,
    });

    // Ground.
    game.add({
        translation: [0, -2, 0],
        scale: [10, 1, 10],
        using: [
            render_shaded(game.materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    // Light and audio source.
    game.add({
        translation: [0, 3, 5],
        using: [light([1, 1, 1], 5), audio_source({music: snd_music}, "music")],
    });

    game.add({
        translation: [-2, 5, 0],
        using: [
            render_basic(game.materials[Mat.Points], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });

    game.add({
        translation: [0, 5, 0],
        using: [
            render_basic(game.materials[Mat.Wireframe], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });

    game.add({
        translation: [2, 5, 0],
        using: [
            render_basic(game.materials[Mat.Basic], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });

    game.add({
        translation: [-2, 1, 0],
        using: [
            render_shaded(game.materials[Mat.Flat], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });

    game.add({
        translation: [0, 1, 0],
        using: [
            render_shaded(game.materials[Mat.Gouraud], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });

    game.add({
        translation: [2, 1, 0],
        using: [
            render_shaded(game.materials[Mat.Phong], Icosphere, [1, 1, 0.3, 1]),
            collide(true),
            rigid_body(true),
            animate({
                idle: ani_scale,
            }),
        ],
    });
}
