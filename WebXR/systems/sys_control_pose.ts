import {Entity} from "../../common/world.js";
import {ControlXrKind} from "../components/com_control_xr.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlXr;

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
    let control = game.World.ControlXr[entity];

    if (control.Kind === ControlXrKind.Head) {
        let pose = game.XrFrame!.getViewerPose(game.XrSpace);
        transform.Translation[0] = pose.transform.position.x;
        transform.Translation[1] = pose.transform.position.y;
        transform.Translation[2] = pose.transform.position.z;
        transform.Rotation[0] = pose.transform.orientation.x;
        transform.Rotation[1] = pose.transform.orientation.y;
        transform.Rotation[2] = pose.transform.orientation.z;
        transform.Rotation[3] = pose.transform.orientation.w;
        transform.Dirty = true;
        return;
    }

    if (control.Kind === ControlXrKind.Left) {
        let input = game.XrInputs["left"];
        if (input) {
            let pose = game.XrFrame!.getPose(input.gripSpace!, game.XrSpace!);
            if (pose) {
                transform.Translation[0] = pose.transform.position.x;
                transform.Translation[1] = pose.transform.position.y;
                transform.Translation[2] = pose.transform.position.z;
                transform.Rotation[0] = pose.transform.orientation.x;
                transform.Rotation[1] = pose.transform.orientation.y;
                transform.Rotation[2] = pose.transform.orientation.z;
                transform.Rotation[3] = pose.transform.orientation.w;
                transform.Dirty = true;
            }
        }
        return;
    }

    if (control.Kind === ControlXrKind.Right) {
        let input = game.XrInputs["right"];
        if (input) {
            let pose = game.XrFrame!.getPose(input.gripSpace!, game.XrSpace!);
            if (pose) {
                transform.Translation[0] = pose.transform.position.x;
                transform.Translation[1] = pose.transform.position.y;
                transform.Translation[2] = pose.transform.position.z;
                transform.Rotation[0] = pose.transform.orientation.x;
                transform.Rotation[1] = pose.transform.orientation.y;
                transform.Rotation[2] = pose.transform.orientation.z;
                transform.Rotation[3] = pose.transform.orientation.w;
                transform.Dirty = true;
            }
        }
        return;
    }
}
