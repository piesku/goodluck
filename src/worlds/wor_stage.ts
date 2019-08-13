import {light_blueprint} from "../blueprints/blu_light.js";
import {audio_source} from "../components/com_audio_source.js";
import {camera} from "../components/com_camera.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rotate} from "../components/com_rotate.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Icosphere} from "../shapes/Icosphere.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_stage(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    game.add({
        translation: [0, 0, 10],
        using: [
            camera(game.canvas.width / game.canvas.height, 1, 0.1, 1000),
            audio_source({music: snd_music}, "music"),
        ],
    });

    game.add({
        translation: [0, 3, 5],
        ...light_blueprint,
    });

    game.add({
        translation: [-3, 1.5, 0],
        using: [
            render_basic(game.materials[Mat.Points], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });

    game.add({
        translation: [0, 1.5, 0],
        using: [
            render_basic(game.materials[Mat.Wireframe], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });

    game.add({
        translation: [3, 1.5, 0],
        using: [
            render_basic(game.materials[Mat.Basic], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });

    game.add({
        translation: [-3, -1.5, 0],
        using: [
            render_shaded(game.materials[Mat.Flat], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });

    game.add({
        translation: [0, -1.5, 0],
        using: [
            render_shaded(game.materials[Mat.Gouraud], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });

    game.add({
        translation: [3, -1.5, 0],
        using: [
            render_shaded(game.materials[Mat.Phong], Icosphere, [1, 1, 0.3, 1]),
            rotate(10, 20, 30),
        ],
    });
}
