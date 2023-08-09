import {camera2d} from "../components/com_camera2d.js";
import {local_transform2d} from "../components/com_local_transform2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game} from "../game.js";

export function blueprint_camera(game: Game) {
    return [
        spatial_node2d(),
        local_transform2d(),
        camera2d([game.World.Width / 2 + 1, game.World.Height / 2 + 1]),
    ];
}
