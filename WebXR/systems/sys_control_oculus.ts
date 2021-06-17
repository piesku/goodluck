import {Vec3} from "../../common/math.js";
import {map_range} from "../../common/number.js";
import {from_axis} from "../../common/quat.js";
import {Entity} from "../../common/world.js";
import {ControlXrKind} from "../components/com_control_xr.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlXr | Has.Children;
const AXIS_Y: Vec3 = [0, 1, 0];

export function sys_control_oculus(game: Game, delta: number) {
    if (!game.XrFrame) {
        return;
    }

    game.XrInputs = {};
    for (let input of game.XrFrame.session.inputSources) {
        if (input.gripSpace) {
            game.XrInputs[input.handedness] = input;
        }
    }

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let children = game.World.Children[entity];
    let control = game.World.ControlXr[entity];

    if (control.Kind === ControlXrKind.Left) {
        let input = game.XrInputs["left"];
        if (input?.gamepad) {
            let squeeze = input.gamepad.buttons[1];
            if (squeeze) {
                // Open or close the hand.
                let hand_entity = children.Children[0];
                let hand_transform = game.World.Transform[hand_entity];
                hand_transform.Scale[2] = map_range(squeeze.value, 0, 1, 1, 0.5);
                from_axis(hand_transform.Rotation, AXIS_Y, -squeeze.value);
                hand_transform.Dirty = true;
            }
        }
    }

    if (control.Kind === ControlXrKind.Right) {
        let input = game.XrInputs["right"];
        if (input?.gamepad) {
            let squeeze = input.gamepad.buttons[1];
            if (squeeze) {
                // Open or close the hand.
                let hand_entity = children.Children[0];
                let hand_transform = game.World.Transform[hand_entity];
                hand_transform.Scale[2] = map_range(squeeze.value, 0, 1, 1, 0.5);
                from_axis(hand_transform.Rotation, AXIS_Y, squeeze.value);
                hand_transform.Dirty = true;
            }
        }
    }
}
