import {GL_CCW} from "../../common/webgl.js";
import {camera_xr} from "../components/com_camera.js";
import {control_xr} from "../components/com_control_xr.js";
import {pose} from "../components/com_pose.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
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
                        Scale: [-1, 1, 1],
                        Using: [
                            render_diffuse(
                                game.MaterialDiffuseGouraud,
                                game.MeshHand,
                                [1, 1, 0.3, 1],
                                GL_CCW
                            ),
                        ],
                    },
                ],
            },
            {
                // Right hand.
                Using: [pose(), control_xr("right")],
                Children: [
                    {
                        Using: [
                            render_diffuse(game.MaterialDiffuseGouraud, game.MeshHand, [
                                1,
                                1,
                                0.3,
                                1,
                            ]),
                        ],
                    },
                ],
            },
        ],
    };
}
