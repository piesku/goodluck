import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export const enum ControlPoseKind {
    Head,
    Left,
    Right,
}

export interface ControlPose {
    Kind: ControlPoseKind;
}

export function control_pose(kind: ControlPoseKind) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlPose;
        game.World.ControlPose[entity] = {
            Kind: kind,
        };
    };
}
