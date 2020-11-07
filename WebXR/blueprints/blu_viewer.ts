import {GL_CCW} from "../../common/webgl.js";
import {camera_xr} from "../components/com_camera.js";
import {ControlPoseKind, control_pose} from "../components/com_control_pose.js";
import {render_colored_diffuse} from "../components/com_render2.js";
import {Blueprint} from "../entity.js";
import {Game} from "../game.js";

export function blueprint_viewer(game: Game): Blueprint {
    return {
        Children: [
            {
                // Headset.
                Using: [camera_xr()],
            },
            {
                // Left hand.
                Using: [control_pose(ControlPoseKind.Left)],
                Children: [
                    {
                        Scale: [-1, 1, 1],
                        Using: [
                            render_colored_diffuse(
                                game.MaterialColoredDiffuseGouraud,
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
                Using: [control_pose(ControlPoseKind.Right)],
                Children: [
                    {
                        Using: [
                            render_colored_diffuse(
                                game.MaterialColoredDiffuseGouraud,
                                game.MeshHand,
                                [1, 1, 0.3, 1]
                            ),
                        ],
                    },
                ],
            },
        ],
    };
}
