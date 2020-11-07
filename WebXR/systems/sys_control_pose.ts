import {ControlPoseKind} from "../components/com_control_pose.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlPose;

export function sys_control_pose(game: Game, delta: number) {
    if (!game.XrFrame) {
        return;
    }

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let control = game.World.ControlPose[entity];

    if (control.Kind === ControlPoseKind.Head) {
        let headset = game.XrFrame!.getViewerPose(game.XrSpace);
        transform.World = headset.transform.matrix;
        transform.Dirty = true;
        return;
    }

    if (control.Kind === ControlPoseKind.Left) {
        let input = game.XrInputs["left"];
        if (input) {
            let pose = game.XrFrame!.getPose(input.gripSpace!, game.XrSpace!);
            if (pose) {
                transform.World = pose.transform.matrix;
                transform.Dirty = true;
            }
        }
        return;
    }

    if (control.Kind === ControlPoseKind.Right) {
        let input = game.XrInputs["right"];
        if (input) {
            let pose = game.XrFrame!.getPose(input.gripSpace!, game.XrSpace!);
            if (pose) {
                transform.World = pose.transform.matrix;
                transform.Dirty = true;
            }
        }
        return;
    }
}
