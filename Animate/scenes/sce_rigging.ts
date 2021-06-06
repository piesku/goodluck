import {from_euler} from "../../common/quat.js";
import {set_seed} from "../../common/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {animate} from "../components/com_animate.js";
import {bone} from "../components/com_bone.js";
import {children} from "../components/com_children.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_skinned} from "../components/com_render_ext.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {instantiate} from "../impl.js";
import {World} from "../world.js";

export function scene_rigging(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    set_seed(Date.now());

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 1, 3], [0, 1, 0, 0])]);

    // Light 1.
    instantiate(game, [transform([2, 3, 5]), light_directional([1, 1, 1], 1)]);

    // Quad.
    instantiate(game, [
        transform([0, 0, 0]),
        children([
            transform([0, 1, 0]),
            bone(0),
            render_colored_skinned(game.MaterialColoredSkinned, game.MeshQuad, [0.2, 0.4, 0.8, 1]),
            children([
                transform([2, 0, 0]),
                bone(1),
                animate({
                    idle: {
                        Keyframes: [
                            {
                                Timestamp: 0,
                                Rotation: from_euler([0, 0, 0, 0], 60, 0, 0),
                            },
                            {
                                Timestamp: 2,
                                Rotation: from_euler([0, 0, 0, 0], -60, 0, 0),
                            },
                        ],
                    },
                }),
            ]),
        ]),
    ]);
}
