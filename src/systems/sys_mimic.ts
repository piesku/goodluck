import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {get_rotation, get_translation} from "../math/mat4.js";
import {slerp} from "../math/quat.js";
import {lerp} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Mimic);

export function sys_mimic(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let follower_transform = game[Get.Transform][i];
            let follower_mimic = game[Get.Mimic][i];
            let target_transform = game[Get.Transform][follower_mimic.target];
            let target_world_position = get_translation([], target_transform.World);
            let target_world_rotation = get_rotation([], target_transform.World);
            // XXX Follower must be a top-level transform for this to work.
            follower_transform.Translation = lerp(
                [],
                follower_transform.Translation,
                target_world_position,
                follower_mimic.stiffness
            );
            follower_transform.Rotation = slerp(
                [],
                follower_transform.Rotation,
                target_world_rotation,
                follower_mimic.stiffness
            );
            follower_transform.Dirty = true;
        }
    }
}
