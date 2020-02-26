import {camera_xr} from "../components/com_camera.js";
import {control_xr} from "../components/com_control_xr.js";
import {pose} from "../components/com_pose.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";

export function blueprint_viewer(game: Game) {
    return <Blueprint>{
        Children: [
            {
                // Headset.
                Using: [camera_xr()],
            },
            {
                // Left hand.
                Using: [pose(), control_xr("left")],
                Children: [
                    {
                        Scale: [0.1, 0.1, 0.2],
                        Using: [render_shaded(game.MaterialGouraud, game.MeshCube, [1, 1, 0.3, 1])],
                    },
                ],
            },
            {
                // Right hand.
                Using: [pose(), control_xr("right")],
                Children: [
                    {
                        Rotation: [0.966, -0.259, 0, 0],
                        Scale: [0.1, 0.1, 0.2],
                        Using: [render_shaded(game.MaterialGouraud, game.MeshCube, [1, 1, 0.3, 1])],
                    },
                ],
            },
        ],
    };
}
