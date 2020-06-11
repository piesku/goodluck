import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlXr;

export function sys_control_xr(game: Game, delta: number) {
    if (!game.XrFrame) {
        return;
    }

    let hand_left: XRPose | undefined;
    let hand_right: XRPose | undefined;

    for (let input of game.XrFrame.session.inputSources) {
        if (!input.gripSpace) {
            continue;
        }
        if (input.handedness === "left") {
            hand_left = game.XrFrame.getPose(input.gripSpace, game.XrSpace!);
            continue;
        }
        if (input.handedness === "right") {
            hand_right = game.XrFrame.getPose(input.gripSpace, game.XrSpace!);
            continue;
        }
    }

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, hand_left, hand_right);
        }
    }
}

function update(game: Game, entity: Entity, hand_left?: XRPose, hand_right?: XRPose) {
    let transform = game.World.Transform[entity];
    let control = game.World.ControlXr[entity];

    if (control.Hand === "left" && hand_left) {
        transform.World = hand_left.transform.matrix;
        transform.Dirty = true;
        return;
    }

    if (control.Hand === "right" && hand_right) {
        transform.World = hand_right.transform.matrix;
        transform.Dirty = true;
        return;
    }
}
