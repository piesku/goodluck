import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_hand} from "../blueprints/blu_hand.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_shaded} from "../components/com_render.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {shake} from "../components/com_shake.js";
import {spawn} from "../components/com_spawn.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 2, 6], [0, 1, 0, 0])]);

    // Light.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 0.5),
    ]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [10, 1, 10]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        collide(false, Layer.Terrain, Layer.None),
        rigid_body(RigidKind.Static),
    ]);

    // Static wall.
    instantiate(game, [
        transform([4, 1, 0], undefined, [1, 1, 10]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        collide(false, Layer.Terrain, Layer.None),
        rigid_body(RigidKind.Static),
    ]);

    // Box spawner.
    instantiate(game, [
        transform([0, 6, 0]),
        children([transform(), shake(0.5), spawn(blueprint_box, 2)]),
    ]);

    // Rotating hand.
    instantiate(game, [
        transform([0, 1, -3]),
        control_always(null, [0, 1, 0, 0]),
        move(0, 2),
        children([...blueprint_hand(game), transform([0, 0, -3])]),
    ]);
}
